"use strict";

// In-memory stub replacement for uuApp Mongo DAO to remove dependency on uu_appg01_server/datastore.
class ListMainMongo {
  constructor() {
    this.store = new Map(); // keyed by awid
  }

  async createSchema() {
    // noop for in-memory
  }

  async create(uuObject) {
    const key = uuObject.awid || "default";
    this.store.set(key, uuObject);
    return uuObject;
  }

  async getByAwid(awid) {
    return this.store.get(awid) || null;
  }

  async update(uuObject) {
    const key = uuObject.awid || "default";
    this.store.set(key, uuObject);
    return uuObject;
  }

  async updateByAwid(uuObject) {
    const key = uuObject.awid || "default";
    this.store.set(key, uuObject);
    return uuObject;
  }

  async deleteByAwid(awid) {
    return this.store.delete(awid);
  }

  async cleanWorkspaceAuthStrategy(/*awid*/) {
    // noop for in-memory
    return null;
  }
}

module.exports = ListMainMongo;
