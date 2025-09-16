import Joi from 'joi';

export const createSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().max(200).required(),
    description: Joi.string().required(),
    problem_statement: Joi.string().allow(''),
    proposed_solution: Joi.string().required(),
    expected_benefits: Joi.string().allow(''),
    implementation_plan: Joi.string().allow(''),
    category_id: Joi.number().integer().required(),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical').default('medium'),
    machine_id: Joi.number().integer().allow(null),
    division_id: Joi.number().integer().allow(null),
    estimated_cost: Joi.number().min(0).default(0),
    estimated_savings: Joi.number().min(0).default(0),
    estimated_implementation_days: Joi.number().integer().min(0).default(0)
  })
});

export const updateSchema = Joi.object({
  params: Joi.object({ 
    kaizen_id: Joi.number().integer().required() 
  }),
  body: Joi.object({
    title: Joi.string().max(200),
    description: Joi.string(),
    problem_statement: Joi.string().allow(''),
    proposed_solution: Joi.string(),
    expected_benefits: Joi.string().allow(''),
    implementation_plan: Joi.string().allow(''),
    category_id: Joi.number().integer(),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical'),
    machine_id: Joi.number().integer().allow(null),
    division_id: Joi.number().integer().allow(null),
    estimated_cost: Joi.number().min(0),
    estimated_savings: Joi.number().min(0),
    estimated_implementation_days: Joi.number().integer().min(0),
    actual_cost: Joi.number().min(0).allow(null),
    actual_savings: Joi.number().min(0).allow(null),
    actual_implementation_days: Joi.number().integer().min(0).allow(null)
  }).min(1)
});

export const listQuerySchema = Joi.object({
  query: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    status_id: Joi.number().integer(),
    category_id: Joi.number().integer(),
    submitted_by: Joi.number().integer(),
    assigned_to: Joi.number().integer(),
    machine_id: Joi.number().integer(),
    division_id: Joi.number().integer(),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical'),
    q: Joi.string().max(100)
  })
});

export const updateStatusSchema = Joi.object({
  params: Joi.object({ 
    kaizen_id: Joi.number().integer().required() 
  }),
  body: Joi.object({
    status_id: Joi.number().integer().required(),
    notes: Joi.string().max(500).allow('')
  })
});

export const assignSchema = Joi.object({
  params: Joi.object({ 
    kaizen_id: Joi.number().integer().required() 
  }),
  body: Joi.object({
    assigned_to: Joi.number().integer().required(),
    notes: Joi.string().max(500).allow('')
  })
});

export const addCommentSchema = Joi.object({
  params: Joi.object({ 
    kaizen_id: Joi.number().integer().required() 
  }),
  body: Joi.object({
    comment: Joi.string().required(),
    is_internal: Joi.boolean().default(false)
  })
});

export const kaizenIdSchema = Joi.object({
  params: Joi.object({ 
    kaizen_id: Joi.number().integer().required() 
  })
});