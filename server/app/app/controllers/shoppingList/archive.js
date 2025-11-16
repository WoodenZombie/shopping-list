const { dtoIn } = require("../../dto/shoppingList/archive-dto");
const Errors = require("../../errors");
const BaseError = require("../../errors/BaseError");
const { checkAuthorization, isListOwner } = require("../../utils/authorization");
const archiveHandler = require("../../commandHandlers/shoppingList/archive");
const ShoppingList = require("../../models/ShoppingList");

async function handler(ucEnv, dtoInData) {
  let validatedDtoIn;
  const uuAppErrorMap = {};

  // Validate dtoIn
  try {
    validatedDtoIn = dtoIn(dtoInData);
  } catch (error) {
    throw new Errors.ShoppingList.Archive.InvalidDtoIn(dtoInData, error);
  }

  // Get shopping list
  const shoppingList = await ShoppingList.get(ucEnv, validatedDtoIn.id);
  if (!shoppingList) {
    throw new Errors.ShoppingList.Archive.ShoppingListNotFound(validatedDtoIn);
  }

  // Check authorization - Authorities or ListOwner can archive
  const isAuthorized = checkAuthorization(ucEnv, ["Authorities"]) ||
    isListOwner(ucEnv, shoppingList);

  if (!isAuthorized) {
    throw new Errors.ShoppingList.Archive.Unauthorized(validatedDtoIn);
  }

  // Call command handler
  let dtoOut;
  try {
    dtoOut = await archiveHandler(ucEnv, validatedDtoIn);
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
