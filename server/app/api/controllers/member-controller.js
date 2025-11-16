"use strict";
const Add = require("../../app/controllers/member/add");
const List = require("../../app/controllers/member/list");
const Remove = require("../../app/controllers/member/remove");

function adaptUcEnv(ucEnv) {
  return {
    session: ucEnv.getSession(),
    uri: ucEnv.getUri(),
    authorizationResult: ucEnv.getAuthorizationResult ? ucEnv.getAuthorizationResult() : undefined
  };
}

class MemberController {
  async add(ucEnv) {
    return Add(adaptUcEnv(ucEnv), ucEnv.getDtoIn());
  }

  async list(ucEnv) {
    return List(adaptUcEnv(ucEnv), ucEnv.getDtoIn());
  }

  async remove(ucEnv) {
    return Remove(adaptUcEnv(ucEnv), ucEnv.getDtoIn());
  }
}

module.exports = new MemberController();
