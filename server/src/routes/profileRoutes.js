const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const profileController = require('../controllers/profileController');

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Profile]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/', verifyToken, profileController.getProfile);

module.exports = router;
