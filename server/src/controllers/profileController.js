const bcrypt = require('bcryptjs');
const prisma = require('../configs/prisma');

/**
 * @desc   Get current user profile
 * @route  GET /v1/api/profile
 */
const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Exclude password_hash from response
    const { password_hash, ...userWithoutPassword } = user;

    res.status(200).json({
      message: 'Profile retrieved successfully',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('[Profile Controller] Fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * @desc   Update user name and/or password
 * @route  PUT /v1/api/profile
 */
const updateProfile = async (req, res) => {
  const { name, password } = req.body;

  try {
    const userId = req.user.id;

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const dataToUpdate = {};

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({ message: 'Name cannot be empty' });
      }
      dataToUpdate.name = name.trim();
    }

    if (password !== undefined && password !== '') {
      if (password.length < 8 || 
          !/[A-Z]/.test(password) || 
          !/[a-z]/.test(password) || 
          !/[0-9]/.test(password) || 
          !/[^A-Za-z0-9]/.test(password)) {
        return res.status(400).json({ 
          message: 'Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one number, and one special character/symbol.' 
        });
      }
      const salt = await bcrypt.genSalt(10);
      dataToUpdate.password_hash = await bcrypt.hash(password, salt);
    }

    // Update in database using Prisma
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    // Exclude password_hash from response
    const { password_hash, ...userWithoutPassword } = updatedUser;

    res.status(200).json({
      message: 'Profile updated successfully',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('[Profile Controller] Update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
