const db = require("../configs/db");

/**
 * @desc   Health check endpoint
 * @route  GET /v1/api/health
 */
const getHealth = (req, res) => {
  const dbStatus = db.getStatus();
  res.json({
    status: "healthy",
    uptime: `${Math.floor(process.uptime())}s`,
    environment: process.env.NODE_ENV,
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
};

module.exports = { getHealth };
