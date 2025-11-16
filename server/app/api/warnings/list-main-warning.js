"use strict";
const ListMainUseCaseWarning = require("./list-main-use-case-warning.js");

const Warnings = {
  Init: {
    UuAwscAlreadyCreated: class extends ListMainUseCaseWarning {
      constructor(paramMap) {
        super("uuAwscAlreadyCreated", "Step uuAwscCreated skipped, uuAwsc already exists.", paramMap);
      }
    },

    ProgressSetStateCallFailed: class extends ListMainUseCaseWarning {
      constructor(paramMap = {}) {
        super("progressSetStateCallFailed", "Failed to call progress/setState uuCommand.", paramMap);
      }
    },
  },

  _initFinalize: {
    ConsoleDoesNotExist: class extends ListMainUseCaseWarning {
      constructor(paramMap) {
        super("consoleDoesNotExist", "Console does not exist.", paramMap);
      }
    },
  },

  _initFinalizeRollback: {
    ConsoleDoesNotExist: class extends ListMainUseCaseWarning {
      constructor(paramMap) {
        super("consoleDoesNotExist", "Console does not exist.", paramMap);
      }
    },

    UuAwscDoesNotExist: class extends ListMainUseCaseWarning {
      constructor(paramMap) {
        super("uuAwscDoesNotExist", "uuAwsc does not exist.", paramMap);
      }
    },

    ProgressDoesNotExist: class extends ListMainUseCaseWarning {
      constructor(paramMap) {
        super("progressDoesNotExist", "Progress does not exist.", paramMap);
      }
    },

    ProgressEndCallFailed: class extends ListMainUseCaseWarning {
      constructor(paramMap = {}) {
        super("progressEndCallFailed", "Failed to call progress/end uuCommand.", paramMap);
      }
    },

    ProgressSetStateCallFailed: class extends ListMainUseCaseWarning {
      constructor(paramMap = {}) {
        super("progressSetStateCallFailed", "Failed to call progress/setState uuCommand.", paramMap);
      }
    },

    ProgressDeleteCallFailed: class extends ListMainUseCaseWarning {
      constructor(paramMap = {}) {
        super("progressDeleteCallFailed", "Failed to call progress/delete uuCommand.", paramMap);
      }
    },
  },

  SetStateClosed: {
    ProgressSetStateCallFailed: class extends ListMainUseCaseWarning {
      constructor(paramMap = {}) {
        super("progressSetStateCallFailed", "Failed to call progress/setState uuCommand.", paramMap);
      }
    },
  },

  _setStateClosedFinalize: {
    AwscAlreadyInFinalState: class extends ListMainUseCaseWarning {
      constructor(paramMap = {}) {
        super("awscAlreadyInFinalState", "Awsc is already in final state.", paramMap);
      }
    },
  },

  _clearFinalize: {
    FailedToDeleteProgress: class extends ListMainUseCaseWarning {
      constructor(paramMap = {}) {
        super("failedToDeleteProgress", "Failed to delete progress.", paramMap);
      }
    },

    FailedToClearConsole: class extends ListMainUseCaseWarning {
      constructor(paramMap = {}) {
        super("failedToClearConsole", "Failed to clear console.", paramMap);
      }
    },
  },
};

module.exports = Warnings;
