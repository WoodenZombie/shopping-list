module.exports = (err, req, res, next) => {
  res.status(400).json({
    data: null,
    uuAppErrorMap: { [err.code || "server/error"]: { message: err.message } },
    status: "error"
  });
};
