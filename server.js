require('dotenv').config();
const validateEnv = require('./src/config/env');

validateEnv(); // fail fast if required env vars are missing

const app = require('./src/app');
const logger = require('./src/utils/logger');

// Keep-Alive Route for Supabase Free Tier (prevents 7-day pause)
app.use('/api', require('./src/routes/keepalive'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

// Handle unexpected errors gracefully instead of silently crashing
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
});
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});