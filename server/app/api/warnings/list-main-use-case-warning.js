"use strict";
const ListMainUseCaseError = require("../errors/list-main-use-case-error.js");

class ListMainUseCaseWarning {
  constructor(code, message, paramMap) {
    this.code = ListMainUseCaseError.generateCode(code);
    this.message = message;
    this.paramMap = paramMap instanceof Error ? undefined : paramMap;
  }
}

module.exports = ListMainUseCaseWarning;
