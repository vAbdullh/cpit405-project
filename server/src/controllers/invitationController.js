const prisma = require('../configs/prisma');

/**
 * Get all invitations (pending & resolved) for the currently logged-in user
 * Route: GET /v1/api/invitations/pending
 */
const getPendingInvitations = async (req, res) => {
  try {
    const email = req.user.email.toLowerCase();

    const invitations = await prisma.tripInvitation.findMany({
      where: {
        inviteeEmail: email
      },
      include: {
        trip: {
          select: {
            id: true,
            title: true,
            city: true,
            description: true
          }
        },
        inviter: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      count: invitations.length,
      data: invitations
    });
  } catch (error) {
    console.error('Get user invitations error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching invitations'
    });
  }
};

/**
 * Accept a pending invitation
 * Route: POST /v1/api/invitations/:invitationId/accept
 */
const acceptInvitation = async (req, res) => {
  try {
    const invitationId = parseInt(req.params.invitationId);
    const userId = req.user.id;
    const userEmail = req.user.email.toLowerCase();

    if (isNaN(invitationId)) {
      return res.status(400).json({ success: false, message: 'Invalid invitation ID format' });
    }

    // Fetch the invitation
    const invitation = await prisma.tripInvitation.findUnique({
      where: { id: invitationId }
    });

    if (!invitation) {
      return res.status(404).json({ success: false, message: 'Invitation not found' });
    }

    // Verify ownership (email matches inviteeEmail)
    if (invitation.inviteeEmail.toLowerCase() !== userEmail) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to accept this invitation'
      });
    }

    // Verify invitation is PENDING
    if (invitation.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: `This invitation is already ${invitation.status.toLowerCase()}`
      });
    }

    // Perform acceptance using Prisma Transaction
    await prisma.$transaction(async (tx) => {
      // 1. Update invitation status to ACCEPTED
      await tx.tripInvitation.update({
        where: { id: invitationId },
        data: { status: 'ACCEPTED' }
      });

      // 2. Check if user is already a member
      const existingMember = await tx.tripMember.findUnique({
        where: {
          tripId_userId: {
            tripId: invitation.tripId,
            userId: userId
          }
        }
      });

      // 3. Add user to the trip members
      if (!existingMember) {
        await tx.tripMember.create({
          data: {
            tripId: invitation.tripId,
            userId: userId,
            role: 'MEMBER'
          }
        });
      }
    });

    res.status(200).json({
      success: true,
      message: 'Invitation accepted successfully'
    });
  } catch (error) {
    console.error('Accept invitation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while accepting invitation'
    });
  }
};

/**
 * Reject a pending invitation
 * Route: POST /v1/api/invitations/:invitationId/reject
 */
const rejectInvitation = async (req, res) => {
  try {
    const invitationId = parseInt(req.params.invitationId);
    const userEmail = req.user.email.toLowerCase();

    if (isNaN(invitationId)) {
      return res.status(400).json({ success: false, message: 'Invalid invitation ID format' });
    }

    // Fetch the invitation
    const invitation = await prisma.tripInvitation.findUnique({
      where: { id: invitationId }
    });

    if (!invitation) {
      return res.status(404).json({ success: false, message: 'Invitation not found' });
    }

    // Verify ownership (email matches inviteeEmail)
    if (invitation.inviteeEmail.toLowerCase() !== userEmail) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to reject this invitation'
      });
    }

    // Verify invitation is PENDING
    if (invitation.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: `This invitation is already ${invitation.status.toLowerCase()}`
      });
    }

    // Update invitation status to REJECTED
    await prisma.tripInvitation.update({
      where: { id: invitationId },
      data: { status: 'REJECTED' }
    });

    res.status(200).json({
      success: true,
      message: 'Invitation rejected successfully'
    });
  } catch (error) {
    console.error('Reject invitation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while rejecting invitation'
    });
  }
};

module.exports = {
  getPendingInvitations,
  acceptInvitation,
  rejectInvitation
};
