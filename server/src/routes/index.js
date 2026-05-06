const express = require('express');
const router = express.Router();

const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');

/**
 * Central Router for v1 API
 */
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);

module.exports = router;
