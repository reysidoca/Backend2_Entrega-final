export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Error servidor";
  if (status >= 500) console.error(err);
  res.status(status).json({ error: message });
};
