const { dtoIn } = require("../../dto/item/add-dto");
const Errors = require("../../errors");
const BaseError = require("../../errors/BaseError");
const { checkAuthorization, isListOwner, isListMember } = require("../../utils/authorization");
const addHandler = require("../../commandHandlers/item/add");
const ShoppingList = require("../../models/ShoppingList");

async function handler(ucEnv, dtoInData) {
  let validatedDtoIn;
  const uuAppErrorMap = {};

  // Validate dtoIn
  try {
    validatedDtoIn = dtoIn(dtoInData);
  } catch (error) {
    throw new Errors.Item.Add.InvalidDtoIn(dtoInData, error);
  }

  // Get shopping list
  const shoppingList = await ShoppingList.get(ucEnv, validatedDtoIn.listId);
  if (!shoppingList) {
    throw new Errors.Item.Add.ShoppingListNotFound(validatedDtoIn);
  }

  // Check authorization - Authorities, ListOwner, or ListMember can add items
  const isAuthorized = checkAuthorization(ucEnv, ["Authorities"]) ||
    isListOwner(ucEnv, shoppingList) ||
    isListMember(ucEnv, shoppingList);

  if (!isAuthorized) {
    throw new Errors.Item.Add.Unauthorized(validatedDtoIn);
  }

  // Call command handler
  let dtoOut;
  try {
    dtoOut = await addHandler(ucEnv, validatedDtoIn);
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
