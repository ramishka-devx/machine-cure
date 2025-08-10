import Joi from 'joi';

export const createSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().max(100).required(),
    machine_id: Joi.number().integer().required()
  })
});

export const updateSchema = Joi.object({
  params: Joi.object({ meter_id: Joi.number().integer().required() }),
  body: Joi.object({
    title: Joi.string().max(100).required(),
    machine_id: Joi.number().integer().required()
  })
});
