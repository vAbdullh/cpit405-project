const { Pool } = require('pg');
require('dotenv').config();

/**
 * Real Database Connection using PostgreSQL
 */

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const db = {
  isConnected: false,

  connect: async () => {
    try {
      console.log(`[DB] Connecting to ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}...`);
      const client = await pool.connect();
      db.isConnected = true;
      console.log("[DB] Connected successfully to PostgreSQL");
      client.release();
      return true;
    } catch (error) {
      console.error("[DB] Connection failed:", error.message);
      db.isConnected = false;
      throw error;
    }
  },

  disconnect: async () => {
    await pool.end();
    db.isConnected = false;
    console.log("[DB] Disconnected from PostgreSQL");
  },

  query: (text, params) => pool.query(text, params),

  getStatus: () => ({
    connected: db.isConnected,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
  }),
};

module.exports = db;
