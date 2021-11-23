const Joi = require("joi");

module.exports = Joi.object({
  full_name: Joi.string().required(),
  instagram: Joi.string().optional(),
});
