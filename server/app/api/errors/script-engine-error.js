"use strict";
const ListMainUseCaseError = require("./list-main-use-case-error.js");

class CallScriptEngineFailed extends ListMainUseCaseError {
  constructor(paramMap = {}, cause = null) {
    super("callScriptEngineFailed", "Call scriptEngine failed.", paramMap, cause);
  }
}

module.exports = {
  CallScriptEngineFailed,
};
