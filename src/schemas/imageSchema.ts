import Joi from 'joi';

const imageSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  photographer: Joi.string().length(24).required()
});

export default imageSchema;
