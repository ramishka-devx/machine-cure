import Joi from 'joi';

export const createSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().max(100).required(),
    parent_id: Joi.number().integer().allow(null),
    division_type_id: Joi.number().integer().required()
  })
});

export const updateSchema = Joi.object({
  params: Joi.object({ division_id: Joi.number().integer().required() }),
  body: Joi.object({
    title: Joi.string().max(100).required(),
    parent_id: Joi.number().integer().allow(null),
    division_type_id: Joi.number().integer().required()
  })
});
