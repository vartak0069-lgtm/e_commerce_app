// Validates that required environment variables exist at startup.
// Fails fast with a clear message instead of confusing errors later.

const required = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'JWT_SECRET',
];

function validateEnv() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.error('👉 Copy .env.example to .env and fill in the values (see comments for free API key steps).');
    process.exit(1);
  }
  console.log('✅ Environment variables validated');
}

module.exports = validateEnv;
