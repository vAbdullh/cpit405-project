const prisma = require('../configs/prisma');

// Helper function to validate required fields
const validateTripData = (title, baseCurrency, city) => {
  if (!title || title.trim() === '') {
    throw new Error('Title is required and cannot be empty');
  }
  if (!baseCurrency || baseCurrency.trim() === '') {
    throw new Error('Base currency is required');
  }
  if (!city || city.trim() === '') {
    throw new Error('City is required');
  }
};

// 1. Create Trip
const createTrip = async (req, res) => {
  try {
    const { title, description, baseCurrency, city } = req.body;
    const userId = req.user.id; // From verifyToken middleware
    
    // Validate required fields
    validateTripData(title, baseCurrency, city);
    
    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (prisma) => {
      // Create the trip
      const trip = await prisma.trip.create({
        data: {
          title: title.trim(),
          description: description || null,
          baseCurrency: baseCurrency.trim().toUpperCase(),
          city: city.trim(),
          creatorId: userId
        }
      });
      
      // Add creator as ADMIN member
      const tripMember = await prisma.tripMember.create({
        data: {
          tripId: trip.id,
          userId: userId,
          role: 'ADMIN'
        }
      });
      
      return { trip, tripMember };
    });
    
    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      data: result.trip
    });
    
  } catch (error) {
    console.error('Create trip error:', error);
    
    if (error.message.includes('required')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error while creating trip'
    });
  }
};

// 2. Get User Trips (List all trips user is member of)
const getUserTrips = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const trips = await prisma.trip.findMany({
      where: {
        members: {
          some: {
            userId: userId
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        creator: {
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
      count: trips.length,
      data: trips
    });
    
  } catch (error) {
    console.error('Get user trips error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching trips'
    });
  }
};

// 3. Get Trip Details by ID
const getTripById = async (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId);
    const userId = req.user.id;
    
    // Validate tripId is a number
    if (isNaN(tripId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid trip ID format'
      });
    }
    
    // Find trip with details and verify user is a member
    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        members: {
          some: {
            userId: userId
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found or you do not have access to this trip'
      });
    }
    
    res.status(200).json({
      success: true,
      data: trip
    });
    
  } catch (error) {
    console.error('Get trip by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching trip details'
    });
  }
};

// 4. Update Trip
const updateTrip = async (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId);
    const userId = req.user.id;
    const { title, description, baseCurrency, city } = req.body;
    
    // Validate tripId
    if (isNaN(tripId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid trip ID format'
      });
    }
    
    // Check if user is a member (specifically ADMIN or can edit)
    const membership = await prisma.tripMember.findFirst({
      where: {
        tripId: tripId,
        userId: userId,
        role: 'ADMIN' // Only admins can edit trips
      }
    });
    
    if (!membership) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this trip. Only trip admins can edit.'
      });
    }
    
    // Prepare update data (only include fields that are provided)
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description;
    if (baseCurrency !== undefined) updateData.baseCurrency = baseCurrency.trim().toUpperCase();
    if (city !== undefined) updateData.city = city.trim();
    
    // Validate title if being updated
    if (updateData.title !== undefined && updateData.title === '') {
      return res.status(400).json({
        success: false,
        message: 'Title cannot be empty'
      });
    }
    
    // Update the trip
    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data: updateData,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    res.status(200).json({
      success: true,
      message: 'Trip updated successfully',
      data: updatedTrip
    });
    
  } catch (error) {
    console.error('Update trip error:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating trip'
    });
  }
};

// 5. Delete Trip
const deleteTrip = async (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId);
    const userId = req.user.id;
    
    // Validate tripId
    if (isNaN(tripId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid trip ID format'
      });
    }
    
    // First, verify the user is the CREATOR of the trip
    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        creatorId: userId
      }
    });
    
    if (!trip) {
      return res.status(403).json({
        success: false,
        message: 'Only the trip creator can delete this trip'
      });
    }
    
    // Delete the trip (ON DELETE CASCADE will handle related records)
    await prisma.trip.delete({
      where: { id: tripId }
    });
    
    res.status(200).json({
      success: true,
      message: 'Trip deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete trip error:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting trip'
    });
  }
};

// 6. Get Trip Members
const getTripMembers = async (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId);
    const userId = req.user.id;

    if (isNaN(tripId)) {
      return res.status(400).json({ success: false, message: 'Invalid trip ID format' });
    }

    // Verify requesting user is a member of the trip
    const userMembership = await prisma.tripMember.findUnique({
      where: {
        tripId_userId: {
          tripId,
          userId
        }
      }
    });

    if (!userMembership) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this trip\'s members'
      });
    }

    const members = await prisma.tripMember.findMany({
      where: { tripId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: members
    });
  } catch (error) {
    console.error('Get trip members error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching members'
    });
  }
};

// 7. Remove Trip Member
const removeTripMember = async (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId);
    const memberIdToRemove = parseInt(req.params.userId);
    const requestingUserId = req.user.id;

    if (isNaN(tripId) || isNaN(memberIdToRemove)) {
      return res.status(400).json({ success: false, message: 'Invalid trip ID or user ID format' });
    }

    // Fetch the trip to check the creator
    const trip = await prisma.trip.findUnique({
      where: { id: tripId }
    });

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    // A user can remove themselves (leave trip)
    const isSelfRemoval = requestingUserId === memberIdToRemove;

    if (!isSelfRemoval) {
      // Otherwise, the requesting user must be ADMIN or Creator of the trip
      const requesterMembership = await prisma.tripMember.findUnique({
        where: {
          tripId_userId: {
            tripId,
            userId: requestingUserId
          }
        }
      });

      if (!requesterMembership || (requesterMembership.role !== 'ADMIN' && trip.creatorId !== requestingUserId)) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to remove members from this trip'
        });
      }
    }

    // Prevent removing the creator of the trip
    if (memberIdToRemove === trip.creatorId) {
      return res.status(400).json({
        success: false,
        message: 'The trip creator cannot be removed or leave the trip'
      });
    }

    // Delete the membership
    await prisma.tripMember.delete({
      where: {
        tripId_userId: {
          tripId,
          userId: memberIdToRemove
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Member removed successfully'
    });
  } catch (error) {
    console.error('Remove trip member error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Member not found in this trip'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error while removing member'
    });
  }
};

// 8. Get Trip Invitations
const getTripInvitations = async (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId);
    const userId = req.user.id;

    if (isNaN(tripId)) {
      return res.status(400).json({ success: false, message: 'Invalid trip ID format' });
    }

    // Fetch the trip to check the creator
    const trip = await prisma.trip.findUnique({
      where: { id: tripId }
    });

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    // Must be creator or an ADMIN member to view invitations
    const userMembership = await prisma.tripMember.findUnique({
      where: {
        tripId_userId: {
          tripId,
          userId
        }
      }
    });

    if (!userMembership || (userMembership.role !== 'ADMIN' && trip.creatorId !== userId)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this trip\'s invitations'
      });
    }

    const invitations = await prisma.tripInvitation.findMany({
      where: { tripId },
      include: {
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
      data: invitations
    });
  } catch (error) {
    console.error('Get trip invitations error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching invitations'
    });
  }
};

// 9. Invite Member to Trip
const inviteMemberToTrip = async (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId);
    const userId = req.user.id;
    const { email } = req.body;

    if (isNaN(tripId)) {
      return res.status(400).json({ success: false, message: 'Invalid trip ID format' });
    }

    if (!email || email.trim() === '') {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const inviteeEmail = email.trim().toLowerCase();

    // Fetch the trip to check the creator
    const trip = await prisma.trip.findUnique({
      where: { id: tripId }
    });

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    // Must be creator or an ADMIN member to invite others
    const userMembership = await prisma.tripMember.findUnique({
      where: {
        tripId_userId: {
          tripId,
          userId
        }
      }
    });

    if (!userMembership || (userMembership.role !== 'ADMIN' && trip.creatorId !== userId)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to invite members to this trip'
      });
    }

    // Check if user is already a member
    const targetUser = await prisma.user.findUnique({
      where: { email: inviteeEmail }
    });

    if (targetUser) {
      const existingMember = await prisma.tripMember.findUnique({
        where: {
          tripId_userId: {
            tripId,
            userId: targetUser.id
          }
        }
      });

      if (existingMember) {
        return res.status(400).json({
          success: false,
          message: 'User is already a member of this trip'
        });
      }
    }

    // Check if there's already a PENDING invitation
    const existingInvitation = await prisma.tripInvitation.findFirst({
      where: {
        tripId,
        inviteeEmail,
        status: 'PENDING'
      }
    });

    if (existingInvitation) {
      return res.status(400).json({
        success: false,
        message: 'An invitation is already pending for this email'
      });
    }

    // Create the invitation
    const newInvitation = await prisma.tripInvitation.create({
      data: {
        tripId,
        inviterId: userId,
        inviteeEmail,
        status: 'PENDING'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Invitation sent successfully',
      data: newInvitation
    });
  } catch (error) {
    console.error('Invite member error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while sending invitation'
    });
  }
};

module.exports = {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getTripMembers,
  removeTripMember,
  getTripInvitations,
  inviteMemberToTrip
};