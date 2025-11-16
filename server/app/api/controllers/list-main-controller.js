"use strict";
const InitAbl = require("../../abl/list-main/init-abl.js");
const InitRollbackAbl = require("../../abl/list-main/init-rollback-abl.js");
const LoadAbl = require("../../abl/list-main/load-abl.js");
const SetStateClosedAbl = require("../../abl/list-main/set-state-closed-abl.js");
const ClearAbl = require("../../abl/list-main/clear-abl.js");
const CommenceAbl = require("../../abl/list-main/commence-abl.js");

class ListMainController {
  init(ucEnv) {
    return InitAbl.init(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  _initFinalize(ucEnv) {
    return InitAbl._initFinalize(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  _initFinalizeRollback(ucEnv) {
    return InitRollbackAbl._initFinalizeRollback(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  load(ucEnv) {
    return LoadAbl.load(ucEnv.getUri(), ucEnv.getSession(), ucEnv.getAuthorizationResult());
  }

  loadBasicData(ucEnv) {
    return LoadAbl.loadBasicData(ucEnv.getUri(), ucEnv.getSession());
  }

  setStateClosed(ucEnv) {
    return SetStateClosedAbl.setStateClosed(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  _setStateClosedFinalize(ucEnv) {
    return SetStateClosedAbl._setStateClosedFinalize(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  clear(ucEnv) {
    return ClearAbl.clear(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  _clearFinalize(ucEnv) {
    return ClearAbl._clearFinalize(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  commence(ucEnv) {
    return CommenceAbl.commence(ucEnv.getUri(), ucEnv.getDtoIn());
  }
}

module.exports = new ListMainController();
