const helmet = require('helmet');

module.exports = helmet({
  contentSecurityPolicy: false, // disabled for simplicity with inline scripts in plain HTML views
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});
