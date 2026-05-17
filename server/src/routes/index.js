const express = require('express');
const router = express.Router();

const tripRoutes = require('./tripRoutes');
const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');
const invitationRoutes = require('./invitationRoutes');

/**
 * Central Router for v1 API
 */
router.use('/trips', tripRoutes);
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/invitations', invitationRoutes);

module.exports = router;