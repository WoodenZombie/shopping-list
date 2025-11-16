"use strict";
const Create = require("../../app/controllers/shoppingList/create");
const Get = require("../../app/controllers/shoppingList/get");
const List = require("../../app/controllers/shoppingList/list");
const Update = require("../../app/controllers/shoppingList/update");
const Archive = require("../../app/controllers/shoppingList/archive");
const Unarchive = require("../../app/controllers/shoppingList/unarchive");
const Delete = require("../../app/controllers/shoppingList/delete");
const Leave = require("../../app/controllers/shoppingList/leave");

function adaptUcEnv(ucEnv) {
  return {
    session: ucEnv.getSession(),
    uri: ucEnv.getUri(),
    authorizationResult: ucEnv.getAuthorizationResult ? ucEnv.getAuthorizationResult() : undefined
  };
}

class ShoppingListController {
  async create(ucEnv) {
    return Create(adaptUcEnv(ucEnv), ucEnv.getDtoIn());
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

  async archive(ucEnv) {
    return Archive(adaptUcEnv(ucEnv), ucEnv.getDtoIn());
  }

  async unarchive(ucEnv) {
    return Unarchive(adaptUcEnv(ucEnv), ucEnv.getDtoIn());
  }

  async delete(ucEnv) {
    return Delete(adaptUcEnv(ucEnv), ucEnv.getDtoIn());
  }

  async leave(ucEnv) {
    return Leave(adaptUcEnv(ucEnv), ucEnv.getDtoIn());
  }
}

module.exports = new ShoppingListController();
