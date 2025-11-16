const { dtoIn } = require("../../dto/shoppingList/update-dto");
const Errors = require("../../errors");
const BaseError = require("../../errors/BaseError");
const { checkAuthorization, isListOwner } = require("../../utils/authorization");
const updateHandler = require("../../commandHandlers/shoppingList/update");
const ShoppingList = require("../../models/ShoppingList");

async function handler(ucEnv, dtoInData) {
  let validatedDtoIn;
  const uuAppErrorMap = {};

  // Validate dtoIn
  try {
    validatedDtoIn = dtoIn(dtoInData);
  } catch (error) {
    throw new Errors.ShoppingList.Update.InvalidDtoIn(dtoInData, error);
  }

  // Get shopping list
  const shoppingList = await ShoppingList.get(ucEnv, validatedDtoIn.id);
  if (!shoppingList) {
    throw new Errors.ShoppingList.Update.ShoppingListNotFound(validatedDtoIn);
  }

  // Check authorization - Authorities or ListOwner can update
  const isAuthorized = checkAuthorization(ucEnv, ["Authorities"]) ||
    isListOwner(ucEnv, shoppingList);

  if (!isAuthorized) {
    throw new Errors.ShoppingList.Update.Unauthorized(validatedDtoIn);
  }

  // Call command handler
  let dtoOut;
  try {
    dtoOut = await updateHandler(ucEnv, validatedDtoIn);
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
