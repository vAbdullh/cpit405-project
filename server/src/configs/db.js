/**
 * Fake Database Connection
 * Simulates a database connection for template purposes.
 * Replace with real DB logic (e.g. mongoose, knex, prisma) when needed.
 */

const fakeDb = {
  isConnected: false,

  connect: async () => {
    console.log(`[DB] Connecting to ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}...`);
    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    fakeDb.isConnected = true;
    console.log("[DB] Connected successfully (fake)");
    return true;
  },

  disconnect: async () => {
    fakeDb.isConnected = false;
    console.log("[DB] Disconnected");
  },

  getStatus: () => ({
    connected: fakeDb.isConnected,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
  }),
};

module.exports = fakeDb;
