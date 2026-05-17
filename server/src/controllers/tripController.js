const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

module.exports = {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip
};