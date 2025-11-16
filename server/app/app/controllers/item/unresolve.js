const { dtoIn } = require("../../dto/item/unresolve-dto");
const Errors = require("../../errors");
const BaseError = require("../../errors/BaseError");
const { checkAuthorization, isListOwner, isListMember } = require("../../utils/authorization");
const unresolveHandler = require("../../commandHandlers/item/unresolve");
const ShoppingList = require("../../models/ShoppingList");

async function handler(ucEnv, dtoInData) {
  let validatedDtoIn;
  const uuAppErrorMap = {};

  // Validate dtoIn
  try {
    validatedDtoIn = dtoIn(dtoInData);
  } catch (error) {
    throw new Errors.Item.Unresolve.InvalidDtoIn(dtoInData, error);
  }

  // Get shopping list
  const shoppingList = await ShoppingList.get(ucEnv, validatedDtoIn.listId);
  if (!shoppingList) {
    throw new Errors.Item.Unresolve.ShoppingListNotFound(validatedDtoIn);
  }

  // Get item to verify it exists
  const Item = require("../../models/Item");
  const item = await Item.get(ucEnv, validatedDtoIn.listId, validatedDtoIn.id);
  if (!item) {
    throw new Errors.Item.Unresolve.ItemNotFound(validatedDtoIn);
  }

  // Check authorization - Authorities, ListOwner, or ListMember can unresolve items
  const isAuthorized = checkAuthorization(ucEnv, ["Authorities"]) ||
    isListOwner(ucEnv, shoppingList) ||
    isListMember(ucEnv, shoppingList);

  if (!isAuthorized) {
    throw new Errors.Item.Unresolve.Unauthorized(validatedDtoIn);
  }

  // Call command handler
  let dtoOut;
  try {
    dtoOut = await unresolveHandler(ucEnv, validatedDtoIn);
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
