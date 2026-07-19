// Utility script: generates a bcrypt hash for a plain text password.
// Usage: node scripts/hashPassword.js "yourPassword123"
const bcrypt = require('bcryptjs');

const password = process.argv[2];
if (!password) {
  console.log('Usage: node scripts/hashPassword.js "yourPassword"');
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  console.log('Bcrypt hash:', hash);
  console.log('Use this in database/seeds/seed.sql to replace the placeholder admin password hash.');
});
