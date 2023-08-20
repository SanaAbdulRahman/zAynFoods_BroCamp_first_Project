const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().trim().min(3).max(15).required(),

  password: Joi.string().min(6).max(8).required(),

 // cPassword: Joi.ref("password"),

  email: Joi.string()
    .trim()
    .lowercase()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "in"] } }),
  mobile: Joi.number().required(),
  role: Joi.string()

});

module.exports = { registerSchema };
