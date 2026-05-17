const express = require('express');
const router = express.Router();
const {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getTripMembers,
  removeTripMember,
  getTripInvitations,
  inviteMemberToTrip
} = require('../controllers/tripController');
const {
  getTripExpenses,
  createTripExpense,
  deleteTripExpense,
  updateExpenseSplitStatus
} = require('../controllers/expenseController');
const { verifyToken } = require('../middlewares/authMiddleware');

// All trip routes require authentication
router.use(verifyToken);

// Trip routes
router.post('/', createTrip);           // POST /v1/api/trips
router.get('/', getUserTrips);          // GET /v1/api/trips
router.get('/:tripId', getTripById);   // GET /v1/api/trips/:tripId
router.put('/:tripId', updateTrip);    // PUT /v1/api/trips/:tripId
router.delete('/:tripId', deleteTrip); // DELETE /v1/api/trips/:tripId

// Nested/Trip-scoped member & invitation routes
router.get('/:tripId/members', getTripMembers);
router.delete('/:tripId/members/:userId', removeTripMember);
router.get('/:tripId/invitations', getTripInvitations);
router.post('/:tripId/invite', inviteMemberToTrip);

// Nested/Trip-scoped expense & split routes
router.get('/:tripId/expenses', getTripExpenses);
router.post('/:tripId/expenses', createTripExpense);
router.delete('/:tripId/expenses/:expenseId', deleteTripExpense);
router.patch('/:tripId/expenses/:expenseId/splits/:userId', updateExpenseSplitStatus);

module.exports = router;