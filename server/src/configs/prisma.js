const { PrismaClient } = require('@prisma/client');

// Dynamically resolve DATABASE_URL hostname for Docker Compose vs Local Host environments
let databaseUrl = process.env.DATABASE_URL;
if (databaseUrl && process.env.DB_HOST === 'db') {
  databaseUrl = databaseUrl.replace('localhost', 'db');
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
  log: ['query', 'info', 'warn', 'error'],
});

module.exports = prisma;
