import Joi from 'joi';

export const registerSchema = Joi.object({
  body: Joi.object({
    first_name: Joi.string().max(50).required(),
    last_name: Joi.string().max(50).required(),
    email: Joi.string().email().max(100).required(),
    password: Joi.string().min(6).max(128).required()
  })
});

export const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
});

export const updateSchema = Joi.object({
  params: Joi.object({ user_id: Joi.number().integer().required() }),
  body: Joi.object({
    first_name: Joi.string().max(50),
    last_name: Joi.string().max(50),
    role_id: Joi.number().integer()
  })
});
