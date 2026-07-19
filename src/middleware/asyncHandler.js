// Wraps async controller functions so rejected promises are passed to next()
// instead of crashing the app - avoids repetitive try/catch in every controller.
module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
