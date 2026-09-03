/**
 * Keep-Alive Route for Supabase Free Tier
 * Prevents database from pausing after 7 days of inactivity
 * Add this route to your Express server (src/routes/keepalive.js)
 */

const express = require('express');
const router = express.Router();

// Import your database client/connection
// Adjust based on your project structure
const supabase = require('../config/supabaseClient'); // or your db config

/**
 * GET /api/keepalive
 * Simple endpoint that queries the database to keep it active
 * Hit this endpoint once every 6-7 days via cron job
 */
router.get('/keepalive', async (req, res) => {
  try {
    // Simple query to keep connection alive
    // This just reads from any table - we use users as it's usually there
    const { data, error } = await supabase
      .from('users') // change table name if needed
      .select('id')
      .limit(1);

    if (error) throw error;

    console.log(`[${new Date().toISOString()}] Keep-alive ping successful`);
    
    return res.status(200).json({
      status: 'success',
      message: 'Database is active and responding',
      timestamp: new Date().toISOString(),
      data_checked: data ? 'users table' : 'no data'
    });

  } catch (error) {
    console.error('[Keep-Alive Error]', error);
    
    return res.status(500).json({
      status: 'error',
      message: 'Keep-alive ping failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;