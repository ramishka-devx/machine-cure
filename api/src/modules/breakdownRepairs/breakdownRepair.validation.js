import Joi from 'joi';

export const createSchema = Joi.object({
  params: Joi.object({
    breakdown_id: Joi.number().integer().required()
  }),
  body: Joi.object({
    repair_title: Joi.string().max(200).required(),
    repair_description: Joi.string().required(),
    repair_type: Joi.string().valid('replacement', 'maintenance', 'adjustment', 'cleaning', 'other').required(),
    parts_used: Joi.string().allow('', null).optional(),
    labor_hours: Joi.number().min(0).default(0),
    parts_cost: Joi.number().min(0).default(0),
    labor_cost: Joi.number().min(0).default(0)
  })
});

export const updateSchema = Joi.object({
  params: Joi.object({
    repair_id: Joi.number().integer().required()
  }),
  body: Joi.object({
    repair_title: Joi.string().max(200).required(),
    repair_description: Joi.string().required(),
    repair_type: Joi.string().valid('replacement', 'maintenance', 'adjustment', 'cleaning', 'other').required(),
    parts_used: Joi.string().allow('', null).optional(),
    labor_hours: Joi.number().min(0).required(),
    parts_cost: Joi.number().min(0).required(),
    labor_cost: Joi.number().min(0).required(),
    notes: Joi.string().allow('', null).optional()
  })
});

export const getByIdSchema = Joi.object({
  params: Joi.object({
    repair_id: Joi.number().integer().required()
  })
});

export const getByBreakdownSchema = Joi.object({
  params: Joi.object({
    breakdown_id: Joi.number().integer().required()
  })
});

export const deleteSchema = Joi.object({
  params: Joi.object({
    repair_id: Joi.number().integer().required()
  })
});

export const startSchema = Joi.object({
  params: Joi.object({
    repair_id: Joi.number().integer().required()
  })
});

export const completeSchema = Joi.object({
  params: Joi.object({
    repair_id: Joi.number().integer().required()
  }),
  body: Joi.object({
    notes: Joi.string().allow('', null).optional(),
    final_labor_hours: Joi.number().min(0).optional(),
    final_parts_cost: Joi.number().min(0).optional(),
    final_labor_cost: Joi.number().min(0).optional()
  })
});