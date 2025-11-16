const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    listId: {
      type: "string"
    },
    email: {
      type: "string",
      format: "email"
    }
  },
  required: ["listId", "email"],
  additionalProperties: false
};

const validate = ajv.compile(schema);

function dtoIn(dtoIn) {
  const valid = validate(dtoIn);
  if (!valid) {
    throw new Error(ajv.errorsText(validate.errors));
  }
  return dtoIn;
}

module.exports = { dtoIn, schema };
