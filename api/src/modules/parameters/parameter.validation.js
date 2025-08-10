import Joi from 'joi';

export const createSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().max(100).required(),
    value_type: Joi.string().valid('string', 'number', 'boolean').required(),
    unit: Joi.string().max(50).allow(''),
    meter_id: Joi.number().integer().required()
  })
});

export const updateSchema = Joi.object({
  params: Joi.object({ parameter_id: Joi.number().integer().required() }),
  body: Joi.object({
    name: Joi.string().max(100).required(),
    value_type: Joi.string().valid('string', 'number', 'boolean').required(),
    unit: Joi.string().max(50).allow(''),
    meter_id: Joi.number().integer().required()
  })
});
