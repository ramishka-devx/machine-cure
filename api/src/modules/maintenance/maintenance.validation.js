import Joi from 'joi';

export const createSchema = Joi.object({
  body: Joi.object({
    machine_id: Joi.number().integer().required(),
    title: Joi.string().max(200).required(),
    description: Joi.string().required(),
    type: Joi.string().valid('preventive', 'corrective', 'predictive', 'emergency', 'routine', 'overhaul').default('routine'),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical').default('medium'),
    estimated_duration_hours: Joi.number().min(0).default(0),
    estimated_cost: Joi.number().min(0).default(0),
    scheduled_date: Joi.date().iso().required(),
    due_date: Joi.date().iso().allow(null).optional()
  })
});

export const updateSchema = Joi.object({
  params: Joi.object({ 
    maintenance_id: Joi.number().integer().required() 
  }),
  body: Joi.object({
    title: Joi.string().max(200).required(),
    description: Joi.string().required(),
    type: Joi.string().valid('preventive', 'corrective', 'predictive', 'emergency', 'routine', 'overhaul').required(),
    status: Joi.string().valid('scheduled', 'in_progress', 'completed', 'cancelled', 'overdue').required(),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical').required(),
    estimated_duration_hours: Joi.number().min(0).required(),
    actual_duration_hours: Joi.number().min(0).allow(null).optional(),
    estimated_cost: Joi.number().min(0).required(),
    actual_cost: Joi.number().min(0).allow(null).optional(),
    scheduled_date: Joi.date().iso().required(),
    due_date: Joi.date().iso().allow(null).optional(),
    started_at: Joi.date().iso().allow(null).optional(),
    completed_at: Joi.date().iso().allow(null).optional()
  })
});

export const listQuerySchema = Joi.object({
  query: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    machine_id: Joi.number().integer(),
    type: Joi.string().valid('preventive', 'corrective', 'predictive', 'emergency', 'routine', 'overhaul'),
    status: Joi.string().valid('scheduled', 'in_progress', 'completed', 'cancelled', 'overdue'),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical'),
    scheduled_by: Joi.number().integer(),
    q: Joi.string().max(100)
  })
});

export const updateStatusSchema = Joi.object({
  params: Joi.object({
    maintenance_id: Joi.number().integer().required()
  }),
  body: Joi.object({
    status: Joi.string().valid('scheduled', 'in_progress', 'completed', 'cancelled', 'overdue').required()
  })
});

export const upcomingQuerySchema = Joi.object({
  query: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    machine_id: Joi.number().integer(),
    type: Joi.string().valid('preventive', 'corrective', 'predictive', 'emergency', 'routine', 'overhaul'),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical')
  })
});