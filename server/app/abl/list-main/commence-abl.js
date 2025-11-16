"use strict";
const { DaoFactory } = require("uu_appg01_server").ObjectStore;

const Errors = require("../../api/errors/list-main-error");
const DtoBuilder = require("../../components/dto-builder");
const Validator = require("../../components/validator");
const ListMainConstants = require("../../constants/list-main-constants");

class CommenceAbl {
  async commence(uri, dtoIn) {
    // HDS 1
    Validator.validateDtoIn(uri, dtoIn);

    // TODO If your application requires any additional steps, add them here...

    // HDS 2
    const promises = Object.values(ListMainConstants.Schemas).map(async (schema) =>
      DaoFactory.getDao(schema).createSchema(),
    );
    try {
      await Promise.all(promises);
    } catch (e) {
      throw new Errors.Commence.SchemaDaoCreateSchemaFailed({}, e);
    }

    // HDS 3
    return DtoBuilder.prepareDtoOut();
  }
}

module.exports = new CommenceAbl();
