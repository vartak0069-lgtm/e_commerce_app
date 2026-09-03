const express = require('express');
const router = express.Router();

/**
 * GET /api/keepalive
 * Prevents Supabase free tier from pausing after 7 days of inactivity
 */
router.get('/keepalive', async (req, res) => {
  try {
    // Method 1: Using REST API directly (no client needed)
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials in environment variables');
    }

    // Make a simple HTTP request to Supabase REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/users?select=id&limit=1`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Supabase API returned ${response.status}`);
    }

    const data = await response.json();

    console.log(`[${new Date().toISOString()}] Keep-alive ping successful`);

    return res.status(200).json({
      status: 'success',
      message: 'Database is active and responding',
      timestamp: new Date().toISOString(),
      table_queried: 'users table'
    });

  } catch (error) {
    console.error('[Keep-Alive Error]', error.message);

    return res.status(500).json({
      status: 'error',
      message: 'Keep-alive ping failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;