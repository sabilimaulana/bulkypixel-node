import Joi from 'joi';

const photographerSchema = Joi.object({
  full_name: Joi.string().required(),
  user_name: Joi.string().required(),
  instagram: Joi.string().optional()
});

export default photographerSchema;
