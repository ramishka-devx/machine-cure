import Joi from 'joi';

export const createSchema = Joi.object({
  body: Joi.object({
    machine_id: Joi.number().integer().required(),
    title: Joi.string().max(200).required(),
    description: Joi.string().required(),
    category_id: Joi.number().integer().required(),
    severity: Joi.string().valid('low', 'medium', 'high', 'critical').default('medium'),
    estimated_downtime_hours: Joi.number().min(0).default(0),
    estimated_repair_cost: Joi.number().min(0).default(0),
    breakdown_start_time: Joi.date().iso().required()
  })
});

export const updateSchema = Joi.object({
  params: Joi.object({
    breakdown_id: Joi.number().integer().required()
  }),
  body: Joi.object({
    title: Joi.string().max(200).required(),
    description: Joi.string().required(),
    category_id: Joi.number().integer().required(),
    severity: Joi.string().valid('low', 'medium', 'high', 'critical').required(),
    assigned_to: Joi.number().integer().allow(null).optional(),
    estimated_downtime_hours: Joi.number().min(0).required(),
    actual_downtime_hours: Joi.number().min(0).allow(null).optional(),
    estimated_repair_cost: Joi.number().min(0).required(),
    actual_repair_cost: Joi.number().min(0).allow(null).optional(),
    breakdown_end_time: Joi.date().iso().allow(null).optional()
  })
});

export const getByIdSchema = Joi.object({
  params: Joi.object({
    breakdown_id: Joi.number().integer().required()
  })
});

export const deleteSchema = Joi.object({
  params: Joi.object({
    breakdown_id: Joi.number().integer().required()
  })
});

export const updateStatusSchema = Joi.object({
  params: Joi.object({
    breakdown_id: Joi.number().integer().required()
  }),
  body: Joi.object({
    status_id: Joi.number().integer().required()
  })
});

export const assignSchema = Joi.object({
  params: Joi.object({
    breakdown_id: Joi.number().integer().required()
  }),
  body: Joi.object({
    assigned_to: Joi.number().integer().required()
  })
});

export const startRepairSchema = Joi.object({
  params: Joi.object({
    breakdown_id: Joi.number().integer().required()
  })
});

export const completeRepairSchema = Joi.object({
  params: Joi.object({
    breakdown_id: Joi.number().integer().required()
  }),
  body: Joi.object({
    actual_downtime_hours: Joi.number().min(0).optional(),
    actual_repair_cost: Joi.number().min(0).optional()
  })
});

export const listSchema = Joi.object({
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    status_id: Joi.number().integer().optional(),
    category_id: Joi.number().integer().optional(),
    reported_by: Joi.number().integer().optional(),
    assigned_to: Joi.number().integer().optional(),
    machine_id: Joi.number().integer().optional(),
    division_id: Joi.number().integer().optional(),
    severity: Joi.string().valid('low', 'medium', 'high', 'critical').optional(),
    is_active: Joi.boolean().optional(),
    date_from: Joi.date().iso().optional(),
    date_to: Joi.date().iso().optional(),
    q: Joi.string().max(255).optional(),
    sort_by: Joi.string().valid('created_at', 'breakdown_start_time', 'title', 'severity', 'status_id').default('created_at'),
    sort_order: Joi.string().valid('asc', 'desc').default('desc')
  })
});