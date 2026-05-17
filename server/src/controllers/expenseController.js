const prisma = require('../configs/prisma');

/**
 * @desc   Get all expenses (including splits) for a trip
 * @route  GET /v1/api/trips/:tripId/expenses
 */
const getTripExpenses = async (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId);
    const userId = req.user.id;

    if (isNaN(tripId)) {
      return res.status(400).json({ success: false, message: 'Invalid trip ID format' });
    }

    // Verify requesting user is a member of the trip
    const member = await prisma.tripMember.findUnique({
      where: {
        tripId_userId: { tripId, userId }
      }
    });

    if (!member) {
      return res.status(403).json({ success: false, message: "You do not have access to this trip's expenses" });
    }

    const expenses = await prisma.expense.findMany({
      where: { tripId },
      include: {
        paidBy: {
          select: { id: true, name: true, email: true }
        },
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        splits: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    console.error('Get trip expenses error:', error);
    res.status(500).json({ success: false, message: 'Internal server error while fetching expenses' });
  }
};

/**
 * @desc   Create a new expense and divide splits among selected members
 * @route  POST /v1/api/trips/:tripId/expenses
 */
const createTripExpense = async (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId);
    const userId = req.user.id;
    const { title, amount, paidById, splits } = req.body;

    if (isNaN(tripId)) {
      return res.status(400).json({ success: false, message: 'Invalid trip ID format' });
    }

    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const totalAmount = parseFloat(amount);
    if (isNaN(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be a positive number' });
    }

    const finalPaidById = parseInt(paidById) || userId;

    // Verify requesting user is a member of the trip
    const requesterMember = await prisma.tripMember.findUnique({
      where: {
        tripId_userId: { tripId, userId }
      }
    });

    if (!requesterMember) {
      return res.status(403).json({ success: false, message: 'You do not have access to create expenses in this trip' });
    }

    // Verify all split participants are members of the trip
    if (!splits || !Array.isArray(splits) || splits.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one split participant is required' });
    }

    for (const split of splits) {
      const pId = parseInt(split.userId);
      if (isNaN(pId)) {
        return res.status(400).json({ success: false, message: 'Invalid participant user ID' });
      }
      const isMember = await prisma.tripMember.findUnique({
        where: {
          tripId_userId: { tripId, userId: pId }
        }
      });
      if (!isMember) {
        return res.status(400).json({ success: false, message: `User ${pId} is not a member of this trip` });
      }
    }

    // Create the expense and splits inside a transaction
    const result = await prisma.$transaction(async (tx) => {
      const expense = await tx.expense.create({
        data: {
          tripId,
          title: title.trim(),
          amount: totalAmount,
          paidById: finalPaidById,
          createdById: userId
        }
      });

      const splitData = splits.map((s) => ({
        expenseId: expense.id,
        userId: parseInt(s.userId),
        amount: parseFloat(s.amount),
        isPaid: s.isPaid === true
      }));

      await tx.expenseSplit.createMany({
        data: splitData
      });

      return tx.expense.findUnique({
        where: { id: expense.id },
        include: {
          paidBy: { select: { id: true, name: true, email: true } },
          createdBy: { select: { id: true, name: true, email: true } },
          splits: {
            include: {
              user: { select: { id: true, name: true, email: true } }
            }
          }
        }
      });
    });

    res.status(201).json({ success: true, message: 'Expense created successfully', data: result });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ success: false, message: 'Internal server error while creating expense' });
  }
};

/**
 * @desc   Delete an expense (splits are deleted cascade)
 * @route  DELETE /v1/api/trips/:tripId/expenses/:expenseId
 */
const deleteTripExpense = async (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId);
    const expenseId = parseInt(req.params.expenseId);
    const userId = req.user.id;

    if (isNaN(tripId) || isNaN(expenseId)) {
      return res.status(400).json({ success: false, message: 'Invalid trip or expense ID format' });
    }

    // Verify requesting user is a member of the trip
    const member = await prisma.tripMember.findUnique({
      where: {
        tripId_userId: { tripId, userId }
      }
    });

    if (!member) {
      return res.status(403).json({ success: false, message: "You do not have access to this trip's expenses" });
    }

    // Fetch the expense to verify ownership or admin rights
    const expense = await prisma.expense.findFirst({
      where: { id: expenseId, tripId }
    });

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    // Only expense creator, payer, or trip admin/creator can delete
    const trip = await prisma.trip.findUnique({
      where: { id: tripId }
    });

    const canDelete =
      expense.createdById === userId ||
      expense.paidById === userId ||
      member.role === 'ADMIN' ||
      trip.creatorId === userId;

    if (!canDelete) {
      return res.status(403).json({ success: false, message: 'You do not have permission to delete this expense' });
    }

    await prisma.expense.delete({
      where: { id: expenseId }
    });

    res.status(200).json({ success: true, message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ success: false, message: 'Internal server error while deleting expense' });
  }
};

/**
 * @desc   Update status (paid/unpaid) for a specific user split in an expense
 * @route  PATCH /v1/api/trips/:tripId/expenses/:expenseId/splits/:userId
 */
const updateExpenseSplitStatus = async (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId);
    const expenseId = parseInt(req.params.expenseId);
    const targetUserId = parseInt(req.params.userId);
    const requestingUserId = req.user.id;
    const { isPaid } = req.body;

    if (isNaN(tripId) || isNaN(expenseId) || isNaN(targetUserId)) {
      return res.status(400).json({ success: false, message: 'Invalid parameter formats' });
    }

    if (isPaid === undefined) {
      return res.status(400).json({ success: false, message: 'isPaid status is required' });
    }

    // Verify requesting user is a member of the trip
    const member = await prisma.tripMember.findUnique({
      where: {
        tripId_userId: { tripId, userId: requestingUserId }
      }
    });

    if (!member) {
      return res.status(403).json({ success: false, message: 'You do not have access to this trip' });
    }

    // Fetch split to verify existence
    const split = await prisma.expenseSplit.findUnique({
      where: {
        expenseId_userId: { expenseId, userId: targetUserId }
      },
      include: {
        expense: true
      }
    });

    if (!split || split.expense.tripId !== tripId) {
      return res.status(404).json({ success: false, message: 'Split record not found' });
    }

    // Permission checks:
    // Only the target user themselves, the person who paid the overall bill,
    // the expense creator, or the trip admin can modify the paid status.
    const isTargetUser = targetUserId === requestingUserId;
    const isPayer = split.expense.paidById === requestingUserId;
    const isCreator = split.expense.createdById === requestingUserId;
    const isTripAdmin = member.role === 'ADMIN';

    if (!isTargetUser && !isPayer && !isCreator && !isTripAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to modify this split status'
      });
    }

    const updatedSplit = await prisma.expenseSplit.update({
      where: {
        expenseId_userId: { expenseId, userId: targetUserId }
      },
      include: {
        user: { select: { id: true, name: true, email: true } }
      },
      data: {
        isPaid: isPaid === true
      }
    });

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      data: updatedSplit
    });
  } catch (error) {
    console.error('Update split status error:', error);
    res.status(500).json({ success: false, message: 'Internal server error while updating split status' });
  }
};

module.exports = {
  getTripExpenses,
  createTripExpense,
  deleteTripExpense,
  updateExpenseSplitStatus
};
