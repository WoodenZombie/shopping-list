module.exports = (err, req, res, next) => {
  // Standardized error response shape
  const status = err.statusCode || err.status || 500;
  const code = err.code || (status >= 500 ? "server/error" : "app/error");
  const payload = {
    data: null,
    uuAppErrorMap: {
      [code]: {
        message: err.message || "Unexpected error",
        details: err.details || undefined
      }
    },
    status: "error"
  };
  res.status(status).json(payload);
};
