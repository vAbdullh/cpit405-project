const express = require('express');
const router = express.Router();
const {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip
} = require('../controllers/tripController');
const { verifyToken } = require('../middlewares/authMiddleware');

// All trip routes require authentication
router.use(verifyToken);

// Trip routes
router.post('/', createTrip);           // POST /v1/api/trips
router.get('/', getUserTrips);          // GET /v1/api/trips
router.get('/:tripId', getTripById);   // GET /v1/api/trips/:tripId
router.put('/:tripId', updateTrip);    // PUT /v1/api/trips/:tripId
router.delete('/:tripId', deleteTrip); // DELETE /v1/api/trips/:tripId

module.exports = router;