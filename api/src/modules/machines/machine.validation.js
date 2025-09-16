import Joi from 'joi';

export const createSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().max(100).required(),
    division_id: Joi.number().integer().required()
  })
});

export const updateSchema = Joi.object({
  params: Joi.object({ machine_id: Joi.number().integer().required() }),
  body: Joi.object({
    title: Joi.string().max(100).required(),
    division_id: Joi.number().integer().required()
  })
});

export const listQuerySchema = Joi.object({
  query: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(10000).default(10),
    division_id: Joi.number().integer(),
    q: Joi.string().max(100)
  })
});
