// Reads x-profile header and attaches profile to req.user
module.exports = (allowedProfiles) => (req, res, next) => {
  const profile = req.header("x-profile") || "member";
  req.user = { profile };
  if (!allowedProfiles.includes(profile)) {
    return res.status(403).json({
      data: null,
      uuAppErrorMap: { "auth/forbidden": { message: "Forbidden" } },
      status: "error"
    });
  }
  next();
};
