export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  console.error(err.message);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: status === 500 ? "Internal server error" : err.message
  });
}
