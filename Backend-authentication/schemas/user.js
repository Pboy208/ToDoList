const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv({ allErros: true });
addFormats(ajv, ["email"]);

const schema = {
  type: "object",
  properties: {
    username: { type: "string", minLength: 5, maxLength: 25 },
    password: { type: "string", minLength: 8, maxLength: 10 },
    email: { type: "string", format: "email" },
    fullname: { type: "string", minLength: 3, maxLength: 255 },
    address: { type: "string", minLength: 4, maxLength: 255 },
  },
  required: ["password", "email", "fullname", "address"],
  additionalProperties: false,
};

module.exports = ajv.compile(schema);
