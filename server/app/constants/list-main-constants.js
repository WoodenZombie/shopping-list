"use strict";

//@@viewOn:constants
const ListMainConstants = {
  AWSC_PREFIX: "shopping -list",
  CONSOLE_PREFIX: "list",
  ERROR_PREFIX: "shopping -list-main",
  INIT_PROGRESS_CODE_PREFIX: "shopping -list-maing01-progress-init-",
  INIT_PROGRESS_NAME_PREFIX: "shopping List Init ",
  SET_STATE_CLOSED_PROGRESS_CODE_PREFIX: "shopping -list-maing01-progress-setStateClosed-",
  SET_STATE_CLOSED_PROGRESS_NAME_PREFIX: "shopping List Set State Closed ",
  CLEAR_PROGRESS_CODE_PREFIX: "shopping -list-maing01-progress-clear-",
  CLEAR_PROGRESS_NAME_PREFIX: "shopping List Clear ",
  UUAPP_CODE: "shopping -list-maing01",

  CONFIG_CACHE_KEY: "configuration",
  UU_APP_ERROR_MAP: "uuAppErrorMap",

  // This is bound matrix of uuAwsc and uuConsole which has authorization bounded to that uuAwsc.
  CONSOLE_BOUND_MATRIX: {
    Authorities: ["Authorities", "Readers", "Writers"],
    Operatives: ["Readers", "Writers"],
    Auditors: ["Readers"],
    SystemIdentity: ["Authorities", "Readers", "Writers"],
  },

  InitStepMap: {
    LIST_OBJECT_CREATED: { code: "shopping ListObjectCreated", message: "The uuObject of shopping List created." },
    AWSC_CREATED: { code: "uuAwscCreated", message: "The uuAwsc of shopping List created." },
    WS_CONNECTED: { code: "uuAppWorkspaceConnected", message: "The shopping List uuAppWorkspace connected." },
    CONSOLE_CREATED: { code: "consoleCreated", message: "The console of shopping List created." },
    PROGRESS_ENDED: { code: "progressEnded", message: "The progress has been ended." },
    WS_ACTIVE: { code: "uuAppWorkspaceActiveState", message: "The uuAppWorkspace of shopping List set to active state." },
  },

  InitRollbackStepMap: {
    CONSOLE_CLEARED: { code: "consoleCleared", message: "The shopping List console has been cleared." },
    WS_DISCONNECTED: { code: "uuAppWorkspaceDisonnected", message: "The shopping List uuAppWorkspace disconnected." },
    AWSC_DELETED: { code: "uuAwscDeleted", message: "The uuAwsc of shopping List deleted." },
    PROGRESS_DELETED: { code: "progressDeleted", message: "The progress has been deleted." },
  },

  SetStateClosedStepMap: {
    CLOSE_STARTED: { code: "setStateClosedStarted", message: "SetStateClosed has started." },
    AWSC_CLOSED: { code: "uuAwscClosed", message: "The uuObject of shopping List set to closed state." },
    PROGRESS_ENDED: { code: "progressEnded", message: "The progress has been ended." },
  },

  ClearStepMap: {
    CLEAR_STARTED: { code: "clearStarted", message: "Clear has started." },
    INIT_PROGRESS_DELETED: { code: "initProgressDeleted", message: "The init progress has been deleted." },
    SET_STATE_CLOSED_PROGRESS_DELETED: {
      code: "setStateClosedProgressDeleted",
      message: "The setStateClosed progress has been deleted.",
    },
    CONSOLE_CLEARED: { code: "consoleCleared", message: "The shopping List console has been cleared." },
    AUTH_STRATEGY_UNSET: {
      code: "authorizationStrategyUnset",
      message: "The authorization strategy has been unset.",
    },
    AWSC_DELETED: { code: "uuAwscDeleted", message: "The uuAwsc of shopping List deleted." },
    PROGRESS_ENDED: { code: "progressEnded", message: "The progress has been ended." },
  },

  ModeMap: {
    STANDARD: "standard",
    RETRY: "retry",
    ROLLBACK: "rollback",
  },

  ProfileMask: {
    STANDARD_USER: parseInt("00010000000000000000000000000000", 2),
  },

  PropertyMap: {
    CONFIG: "config",
    SCRIPT_CONFIG: "scriptConfig",
    LIST_CONFIG: "shopping ListConfig",
  },

  Schemas: {
    LIST_INSTANCE: "listMain",
  },

  SharedResources: {
    SCRIPT_CONSOLE: "uu-console-maing02",
    SCRIPT_ENGINE: "uu-script-engineg02",
  },

  StateMap: {
    CREATED: "created",
    BEING_INITIALIZED: "beingInitialized",
    ACTIVE: "active",
    FINAL: "closed",
  },

  getMainConsoleCode: (awid) => {
    return `shopping -list-maing01-console-${awid}`;
  },

  getInitProgressCode: (awid) => {
    return `${ListMainConstants.INIT_PROGRESS_CODE_PREFIX}${awid}`;
  },

  getInitProgressName: (awid) => {
    return `${ListMainConstants.INIT_PROGRESS_NAME_PREFIX}${awid}`;
  },

  getSetStateClosedProgressName: (awid) => {
    return `${ListMainConstants.SET_STATE_CLOSED_PROGRESS_NAME_PREFIX}${awid}`;
  },

  getSetStateClosedProgressCode: (awid) => {
    return `${ListMainConstants.SET_STATE_CLOSED_PROGRESS_CODE_PREFIX}${awid}`;
  },

  getClearProgressName: (awid) => {
    return `${ListMainConstants.CLEAR_PROGRESS_NAME_PREFIX}${awid}`;
  },

  getClearProgressCode: (awid) => {
    return `${ListMainConstants.CLEAR_PROGRESS_CODE_PREFIX}${awid}`;
  },

  getInitStepCount: () => {
    return Object.keys(ListMainConstants.InitStepMap).length;
  },

  getInitRollbackStepCount: () => {
    return Object.keys(ListMainConstants.InitRollbackStepMap).length;
  },

  getSetStateClosedStepCount: () => {
    return Object.keys(ListMainConstants.SetStateClosedStepMap).length;
  },

  getClearStepCount: () => {
    return Object.keys(ListMainConstants.ClearStepMap).length;
  },
};
//@@viewOff:constants

//@@viewOn:exports
module.exports = ListMainConstants;
//@@viewOff:exports
