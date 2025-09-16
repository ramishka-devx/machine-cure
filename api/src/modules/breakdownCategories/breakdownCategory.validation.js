import Joi from 'joi';

export const createSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().max(100).required(),
    description: Joi.string().allow('', null).optional()
  })
});

export const updateSchema = Joi.object({
  params: Joi.object({
    category_id: Joi.number().integer().required()
  }),
  body: Joi.object({
    name: Joi.string().max(100).required(),
    description: Joi.string().allow('', null).optional()
  })
});

export const getByIdSchema = Joi.object({
  params: Joi.object({
    category_id: Joi.number().integer().required()
  })
});

export const deleteSchema = Joi.object({
  params: Joi.object({
    category_id: Joi.number().integer().required()
  })
});