const { dtoIn } = require("../../dto/shoppingList/leave-dto");
const Errors = require("../../errors");
const BaseError = require("../../errors/BaseError");
const { checkAuthorization, isListMember } = require("../../utils/authorization");
const leaveHandler = require("../../commandHandlers/shoppingList/leave");
const ShoppingList = require("../../models/ShoppingList");

async function handler(ucEnv, dtoInData) {
  let validatedDtoIn;
  const uuAppErrorMap = {};

  // Validate dtoIn
  try {
    validatedDtoIn = dtoIn(dtoInData);
  } catch (error) {
    throw new Errors.ShoppingList.Leave.InvalidDtoIn(dtoInData, error);
  }

  // Get shopping list
  const shoppingList = await ShoppingList.get(ucEnv, validatedDtoIn.id);
  if (!shoppingList) {
    throw new Errors.ShoppingList.Leave.ShoppingListNotFound(validatedDtoIn);
  }

  // Check authorization - Authorities or ListMember can leave
  // Note: Owner cannot leave (they must delete the list instead)
  const isAuthorized = checkAuthorization(ucEnv, ["Authorities"]) ||
    isListMember(ucEnv, shoppingList);

  if (!isAuthorized) {
    throw new Errors.ShoppingList.Leave.Unauthorized(validatedDtoIn);
  }

  // Call command handler
  let dtoOut;
  try {
    dtoOut = await leaveHandler(ucEnv, validatedDtoIn);
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
