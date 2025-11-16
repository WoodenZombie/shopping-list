"use strict";
const Add = require("../../app/controllers/item/add");
const Get = require("../../app/controllers/item/get");
const List = require("../../app/controllers/item/list");
const Update = require("../../app/controllers/item/update");
const Remove = require("../../app/controllers/item/remove");
const Resolve = require("../../app/controllers/item/resolve");
const Unresolve = require("../../app/controllers/item/unresolve");

function adaptUcEnv(ucEnv) {
  return {
    session: ucEnv.getSession(),
    uri: ucEnv.getUri(),
    authorizationResult: ucEnv.getAuthorizationResult ? ucEnv.getAuthorizationResult() : undefined
  };
}

class ItemController {
  async add(ucEnv) {
    return Add(adaptUcEnv(ucEnv), ucEnv.getDtoIn());
  }

  async get(ucEnv) {
    return Get(adaptUcEnv(ucEnv), ucEnv.getDtoIn());
  }

  async list(ucEnv) {
    return List(adaptUcEnv(ucEnv), ucEnv.getDtoIn());
  }

  async update(ucEnv) {
    return Update(adaptUcEnv(ucEnv), ucEnv.getDtoIn());
  }

  async remove(ucEnv) {
    return Remove(adaptUcEnv(ucEnv), ucEnv.getDtoIn());
  }

  async resolve(ucEnv) {
    return Resolve(adaptUcEnv(ucEnv), ucEnv.getDtoIn());
  }

  async unresolve(ucEnv) {
    return Unresolve(adaptUcEnv(ucEnv), ucEnv.getDtoIn());
  }
}

module.exports = new ItemController();
