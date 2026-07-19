const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

function writeLog(level, message) {
  const line = `[${new Date().toISOString()}] [${level}] ${message}\n`;
  console.log(line.trim());
  fs.appendFile(path.join(logDir, 'app.log'), line, () => {});
}

module.exports = {
  info: (msg) => writeLog('INFO', msg),
  error: (msg) => writeLog('ERROR', msg),
  warn: (msg) => writeLog('WARN', msg),
};
