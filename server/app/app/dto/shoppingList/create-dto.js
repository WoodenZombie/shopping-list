const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 1,
      maxLength: 255
    },
    members: {
      type: "array",
      items: {
        type: "object",
        properties: {
          email: {
            type: "string",
            format: "email"
          }
        },
        required: ["email"],
        additionalProperties: false
      }
    }
  },
  required: ["name"],
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
