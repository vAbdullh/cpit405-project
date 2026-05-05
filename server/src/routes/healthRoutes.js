const express = require("express");
const router = express.Router();
const { getHealth } = require("../controllers/healthController");

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 */
router.get("/", getHealth);

module.exports = router;
