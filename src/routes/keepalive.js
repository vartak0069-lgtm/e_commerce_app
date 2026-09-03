const express = require('express');
const https = require('https');
const router = express.Router();

/**
 * GET /api/keepalive
 * Prevents Supabase free tier from pausing after 7 days of inactivity
 */
router.get('/keepalive', (req, res) => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        status: 'error',
        message: 'Missing Supabase credentials',
        timestamp: new Date().toISOString()
      });
    }

    // Parse URL
    const url = new URL(`${supabaseUrl}/rest/v1/users?select=id&limit=1`);

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      }
    };

    const request = https.request(options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        console.log(`[${new Date().toISOString()}] Keep-alive ping successful`);

        return res.status(200).json({
          status: 'success',
          message: 'Database is active and responding',
          timestamp: new Date().toISOString(),
          table_queried: 'users table'
        });
      });
    });

    request.on('error', (error) => {
      console.error('[Keep-Alive Error]', error.message);

      return res.status(500).json({
        status: 'error',
        message: 'Keep-alive ping failed',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    });

    request.end();

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