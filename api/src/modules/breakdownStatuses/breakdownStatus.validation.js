import Joi from 'joi';

export const createSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().max(50).required(),
    description: Joi.string().allow('', null).optional(),
    sort_order: Joi.number().integer().min(0).default(0).optional()
  })
});

export const updateSchema = Joi.object({
  params: Joi.object({
    status_id: Joi.number().integer().required()
  }),
  body: Joi.object({
    name: Joi.string().max(50).required(),
    description: Joi.string().allow('', null).optional(),
    sort_order: Joi.number().integer().min(0).required()
  })
});

export const getByIdSchema = Joi.object({
  params: Joi.object({
    status_id: Joi.number().integer().required()
  })
});

export const deleteSchema = Joi.object({
  params: Joi.object({
    status_id: Joi.number().integer().required()
  })
});