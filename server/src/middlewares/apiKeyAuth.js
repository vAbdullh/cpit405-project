/**
 * API Key Authentication Middleware
 * Validates a static API key from the request header against the one in .env.dev
 *
 * Expected header:  x-api-key: <your-key>
 */

const validateApiKey = (req, res, next) => {
  const clientKey = req.headers["x-api-key"];

  if (!clientKey) {
    return res.status(401).json({
      message: "Missing API key. Provide it via the 'x-api-key' header.",
    });
  }

  if (clientKey !== process.env.API_KEY) {
    return res.status(403).json({
      message: "Invalid API key.",
    });
  }

  next();
};

module.exports = validateApiKey;
