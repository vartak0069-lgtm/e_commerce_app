const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const corsMiddleware = require('./middleware/cors');
const helmetMiddleware = require('./middleware/helmet');
const loggingMiddleware = require('./middleware/logging');
const compressionMiddleware = require('./middleware/compression');
const { apiLimiter } = require('./middleware/rateLimit');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const apiRoutes = require('./routes/index');

const app = express();

// --- Security & performance middleware ---
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(compressionMiddleware);
app.use(loggingMiddleware);

// --- Body parsing ---
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Static files (frontend: HTML/CSS/JS) ---
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serves all HTML pages directly from /views at the site root, so links like
// /auth/login.html, /product-detail.html, /admin/dashboard.html all just work.
app.use(express.static(path.join(__dirname, '../views')));

// --- API routes ---
app.use('/api', apiLimiter, apiRoutes);

// --- 404 and error handling (must be last) ---
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return notFoundHandler(req, res, next);
  res.status(404).sendFile(path.join(__dirname, '../views/errors/404.html'), (err) => {
    if (err) res.status(404).send('Page not found');
  });
});
app.use(errorHandler);

module.exports = app;
