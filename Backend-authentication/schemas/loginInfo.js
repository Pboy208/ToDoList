const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv({ allErros: true });
addFormats(ajv);

const schema = {
  type: "object",
  properties: {
    username: { type: "string", minLength: 5, maxLength: 25 },
    password: { type: "string", minLength: 8, maxLength: 10 },
  },
  required: ["username", "password"],
  additionalProperties: false,
};

module.exports = ajv.compile(schema);
