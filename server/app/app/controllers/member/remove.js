const { dtoIn } = require("../../dto/member/remove-dto");
const Errors = require("../../errors");
const BaseError = require("../../errors/BaseError");
const { checkAuthorization, isListOwner } = require("../../utils/authorization");
const removeHandler = require("../../commandHandlers/member/remove");
const ShoppingList = require("../../models/ShoppingList");

async function handler(ucEnv, dtoInData) {
  let validatedDtoIn;
  const uuAppErrorMap = {};

  // Validate dtoIn
  try {
    validatedDtoIn = dtoIn(dtoInData);
  } catch (error) {
    throw new Errors.Member.Remove.InvalidDtoIn(dtoInData, error);
  }

  // Get shopping list
  const shoppingList = await ShoppingList.get(ucEnv, validatedDtoIn.listId);
  if (!shoppingList) {
    throw new Errors.Member.Remove.ShoppingListNotFound(validatedDtoIn);
  }

  // Check authorization - Only Authorities or ListOwner can remove members
  const isAuthorized = checkAuthorization(ucEnv, ["Authorities"]) ||
    isListOwner(ucEnv, shoppingList);

  if (!isAuthorized) {
    throw new Errors.Member.Remove.Unauthorized(validatedDtoIn);
  }

  // Check member exists
  const memberExists = shoppingList.members.some(m => m.userId === validatedDtoIn.userId);
  if (!memberExists) {
    throw new Errors.Member.Remove.MemberNotFound(validatedDtoIn);
  }

  // Call command handler
  let dtoOut;
  try {
    dtoOut = await removeHandler(ucEnv, validatedDtoIn);
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
