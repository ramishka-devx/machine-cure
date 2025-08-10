import Joi from 'joi';

export const createSchema = Joi.object({
  body: Joi.object({ title: Joi.string().max(100).required() })
});

export const updateSchema = Joi.object({
  params: Joi.object({ division_type_id: Joi.number().integer().required() }),
  body: Joi.object({ title: Joi.string().max(100).required() })
});
