"use strict";
const ListMainUseCaseError = require("./list-main-use-case-error.js");

class InvalidDtoIn extends ListMainUseCaseError {
  constructor(dtoOut, paramMap = {}, cause = null) {
    super("invalidDtoIn", "DtoIn is not valid.", paramMap, cause, undefined, dtoOut);
  }
}

module.exports = {
  InvalidDtoIn,
};
