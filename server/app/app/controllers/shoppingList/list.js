const { dtoIn } = require("../../dto/shoppingList/list-dto");
const Errors = require("../../errors");
const BaseError = require("../../errors/BaseError");
const { checkAuthorization } = require("../../utils/authorization");
const listHandler = require("../../commandHandlers/shoppingList/list");

async function handler(ucEnv, dtoInData) {
  let validatedDtoIn;
  const uuAppErrorMap = {};

  // Validate dtoIn
  try {
    validatedDtoIn = dtoIn(dtoInData);
  } catch (error) {
    throw new Errors.ShoppingList.List.InvalidDtoIn(dtoInData, error);
  }

  // Check authorization - Authorities, ListOwner, or ListMember can list
  if (!checkAuthorization(ucEnv, ["Authorities", "ListOwner", "ListMember"])) {
    throw new Errors.ShoppingList.List.Unauthorized(validatedDtoIn);
  }

  // Call command handler
  let dtoOut;
  try {
    dtoOut = await listHandler(ucEnv, validatedDtoIn);
  } catch (error) {
    if (error instanceof BaseError) {
      uuAppErrorMap[error.code] = error.toMap();
    } else {
      throw error;
    }
  }

  return {
    ...dtoOut,
    uuAppErrorMap
  };
}

module.exports = handler;
