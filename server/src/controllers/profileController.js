const User = require('../models/User');

/**
 * @desc   Get current user profile
 * @route  GET /v1/api/profile
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile retrieved successfully',
      user,
    });
  } catch (error) {
    console.error('[Profile Controller] Fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getProfile,
};
