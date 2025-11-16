"use strict";

// Simple Express middleware replacing uuApp's UseCaseContext usage.
module.exports = function (req, res, next) {
  res.locals.uuAppErrorMap = {};
  next();
};
