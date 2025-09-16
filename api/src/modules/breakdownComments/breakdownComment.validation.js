import Joi from 'joi';

export const createSchema = Joi.object({
  params: Joi.object({
    breakdown_id: Joi.number().integer().required()
  }),
  body: Joi.object({
    comment: Joi.string().required(),
    is_internal: Joi.boolean().default(false)
  })
});

export const updateSchema = Joi.object({
  params: Joi.object({
    comment_id: Joi.number().integer().required()
  }),
  body: Joi.object({
    comment: Joi.string().required(),
    is_internal: Joi.boolean().required()
  })
});

export const getByIdSchema = Joi.object({
  params: Joi.object({
    comment_id: Joi.number().integer().required()
  })
});

export const getByBreakdownSchema = Joi.object({
  params: Joi.object({
    breakdown_id: Joi.number().integer().required()
  }),
  query: Joi.object({
    include_internal: Joi.boolean().default(true)
  })
});

export const deleteSchema = Joi.object({
  params: Joi.object({
    comment_id: Joi.number().integer().required()
  })
});