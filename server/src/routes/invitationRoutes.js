const express = require('express');
const router = express.Router();
const {
  getPendingInvitations,
  acceptInvitation,
  rejectInvitation
} = require('../controllers/invitationController');
const { verifyToken } = require('../middlewares/authMiddleware');

// All invitation routes require authentication
router.use(verifyToken);

// Invitation endpoints
router.get('/pending', getPendingInvitations);           // GET /v1/api/invitations/pending
router.post('/:invitationId/accept', acceptInvitation);  // POST /v1/api/invitations/:invitationId/accept
router.post('/:invitationId/reject', rejectInvitation);  // POST /v1/api/invitations/:invitationId/reject

module.exports = router;
