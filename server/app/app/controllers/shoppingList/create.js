const { dtoIn } = require("../../dto/shoppingList/create-dto");
const Errors = require("../../errors");
const BaseError = require("../../errors/BaseError");
const { checkAuthorization } = require("../../utils/authorization");
const createHandler = require("../../commandHandlers/shoppingList/create");

async function handler(ucEnv, dtoInData) {
  let validatedDtoIn;
  const uuAppErrorMap = {};

  // Validate dtoIn
  try {
    validatedDtoIn = dtoIn(dtoInData);
  } catch (error) {
    throw new Errors.ShoppingList.Create.InvalidDtoIn(dtoInData, error);
  }

  // Check authorization - Any authenticated user can create lists (they become the owner)
  // Authorities have full access, but we also allow any authenticated user
  if (!ucEnv || !ucEnv.session || !ucEnv.session.identity) {
    throw new Errors.ShoppingList.Create.Unauthorized(validatedDtoIn);
  }

  // Call command handler
  let dtoOut;
  try {
    dtoOut = await createHandler(ucEnv, validatedDtoIn);
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
