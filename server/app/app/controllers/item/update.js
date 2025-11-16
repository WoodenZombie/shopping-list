const { dtoIn } = require("../../dto/item/update-dto");
const Errors = require("../../errors");
const BaseError = require("../../errors/BaseError");
const { checkAuthorization, isListOwner, isListMember } = require("../../utils/authorization");
const updateHandler = require("../../commandHandlers/item/update");
const ShoppingList = require("../../models/ShoppingList");
const Item = require("../../models/Item");

async function handler(ucEnv, dtoInData) {
  let validatedDtoIn;
  const uuAppErrorMap = {};

  // Validate dtoIn
  try {
    validatedDtoIn = dtoIn(dtoInData);
  } catch (error) {
    throw new Errors.Item.Update.InvalidDtoIn(dtoInData, error);
  }

  // Get shopping list
  const shoppingList = await ShoppingList.get(ucEnv, validatedDtoIn.listId);
  if (!shoppingList) {
    throw new Errors.Item.Update.ShoppingListNotFound(validatedDtoIn);
  }

  // Get item
  const item = await Item.get(ucEnv, validatedDtoIn.listId, validatedDtoIn.id);
  if (!item) {
    throw new Errors.Item.Update.ItemNotFound(validatedDtoIn);
  }

  // Check authorization - Authorities, ListOwner, or ListMember can update items
  const isAuthorized = checkAuthorization(ucEnv, ["Authorities"]) ||
    isListOwner(ucEnv, shoppingList) ||
    isListMember(ucEnv, shoppingList);

  if (!isAuthorized) {
    throw new Errors.Item.Update.Unauthorized(validatedDtoIn);
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
