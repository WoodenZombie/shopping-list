const { dtoIn } = require("../../dto/shoppingList/get-dto");
const Errors = require("../../errors");
const BaseError = require("../../errors/BaseError");
const { checkAuthorization, isListOwner, isListMember } = require("../../utils/authorization");
const getHandler = require("../../commandHandlers/shoppingList/get");
const ShoppingList = require("../../models/ShoppingList");

async function handler(ucEnv, dtoInData) {
  let validatedDtoIn;
  const uuAppErrorMap = {};

  // Validate dtoIn
  try {
    validatedDtoIn = dtoIn(dtoInData);
  } catch (error) {
    throw new Errors.ShoppingList.Get.InvalidDtoIn(dtoInData, error);
  }

  // Get shopping list
  const shoppingList = await ShoppingList.get(ucEnv, validatedDtoIn.id);
  if (!shoppingList) {
    throw new Errors.ShoppingList.Get.ShoppingListNotFound(validatedDtoIn);
  }

  // Check authorization - Authorities, ListOwner, or ListMember can get
  const isAuthorized = checkAuthorization(ucEnv, ["Authorities"]) ||
    isListOwner(ucEnv, shoppingList) ||
    isListMember(ucEnv, shoppingList);

  if (!isAuthorized) {
    throw new Errors.ShoppingList.Get.Unauthorized(validatedDtoIn);
  }

  // Call command handler
  let dtoOut;
  try {
    dtoOut = await getHandler(ucEnv, validatedDtoIn);
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
