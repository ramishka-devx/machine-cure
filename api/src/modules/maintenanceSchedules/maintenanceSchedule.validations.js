import Joi from 'joi';

export const createSchema = Joi.object({
  body: Joi.object({
    machine_id: Joi.number()
      .integer()
      .min(1)
      .required()
      .messages({
        'number.base': 'Machine ID must be a number.',
        'number.integer': 'Machine ID must be an integer.',
        'number.min': 'Machine ID must be greater than 0.',
        'any.required': 'Machine ID is required.'
      }),
    maintenance_type_id: Joi.number()
      .integer()
      .min(1)
      .required()
      .messages({
        'number.base': 'Maintenance type ID must be a number.',
        'number.integer': 'Maintenance type ID must be an integer.',
        'number.min': 'Maintenance type ID must be greater than 0.',
        'any.required': 'Maintenance type ID is required.'
      }),
    frequency_days: Joi.number()
      .integer()
      .min(1)
      .max(3650)
      .required()
      .messages({
        'number.base': 'Frequency days must be a number.',
        'number.integer': 'Frequency days must be an integer.',
        'number.min': 'Frequency days must be at least 1 day.',
        'number.max': 'Frequency days cannot exceed 3650 days (10 years).',
        'any.required': 'Frequency days is required.'
      }),
    next_due_date: Joi.date()
      .iso()
      .allow(null)
      .optional()
      .messages({
        'date.base': 'Next due date must be a valid date.',
        'date.format': 'Next due date must be in ISO format (YYYY-MM-DD).'
      }),
    assigned_to: Joi.number()
      .integer()
      .min(1)
      .allow(null)
      .optional()
      .messages({
        'number.base': 'Assigned to must be a number.',
        'number.integer': 'Assigned to must be an integer.',
        'number.min': 'Assigned to must be greater than 0.'
      }),
    created_by: Joi.number()
      .integer()
      .min(1)
      .required()
      .messages({
        'number.base': 'Created by must be a number.',
        'number.integer': 'Created by must be an integer.',
        'number.min': 'Created by must be greater than 0.',
        'any.required': 'Created by is required.'
      }),
    notes: Joi.string()
      .max(1000)
      .allow('')
      .optional()
      .messages({
        'string.base': 'Notes must be a text value.',
        'string.max': 'Notes cannot exceed 1000 characters.'
      })
  })
});

export const updateSchema = Joi.object({
  params: Joi.object({
    id: Joi.number()
      .integer()
      .min(1)
      .required()
      .messages({
        'number.base': 'Schedule ID must be a number.',
        'number.integer': 'Schedule ID must be an integer.',
        'number.min': 'Schedule ID must be greater than 0.',
        'any.required': 'Schedule ID is required.'
      })
  }),
  body: Joi.object({
    machine_id: Joi.number()
      .integer()
      .min(1)
      .optional()
      .messages({
        'number.base': 'Machine ID must be a number.',
        'number.integer': 'Machine ID must be an integer.',
        'number.min': 'Machine ID must be greater than 0.'
      }),
    maintenance_type_id: Joi.number()
      .integer()
      .min(1)
      .optional()
      .messages({
        'number.base': 'Maintenance type ID must be a number.',
        'number.integer': 'Maintenance type ID must be an integer.',
        'number.min': 'Maintenance type ID must be greater than 0.'
      }),
    frequency_days: Joi.number()
      .integer()
      .min(1)
      .max(3650)
      .optional()
      .messages({
        'number.base': 'Frequency days must be a number.',
        'number.integer': 'Frequency days must be an integer.',
        'number.min': 'Frequency days must be at least 1 day.',
        'number.max': 'Frequency days cannot exceed 3650 days (10 years).'
      }),
    next_due_date: Joi.date()
      .iso()
      .allow(null)
      .optional()
      .messages({
        'date.base': 'Next due date must be a valid date.',
        'date.format': 'Next due date must be in ISO format (YYYY-MM-DD).'
      }),
    assigned_to: Joi.number()
      .integer()
      .min(1)
      .allow(null)
      .optional()
      .messages({
        'number.base': 'Assigned to must be a number.',
        'number.integer': 'Assigned to must be an integer.',
        'number.min': 'Assigned to must be greater than 0.'
      }),
    notes: Joi.string()
      .max(1000)
      .allow('')
      .optional()
      .messages({
        'string.base': 'Notes must be a text value.',
        'string.max': 'Notes cannot exceed 1000 characters.'
      })
  })
});

export const listQuerySchema = Joi.object({
  query: Joi.object({
    page: Joi.number()
      .min(1)
      .default(1)
      .messages({
        'number.base': 'Page must be a number.',
        'number.min': 'Page must be at least 1.'
      }),
    limit: Joi.number()
      .min(1)
      .max(1000)
      .default(10)
      .messages({
        'number.base': 'Limit must be a number.',
        'number.min': 'Limit must be at least 1.',
        'number.max': 'Limit cannot exceed 1000.'
      }),
    machine_id: Joi.number()
      .integer()
      .min(1)
      .optional()
      .messages({
        'number.base': 'Machine ID must be a number.',
        'number.integer': 'Machine ID must be an integer.',
        'number.min': 'Machine ID must be greater than 0.'
      }),
    maintenance_type_id: Joi.number()
      .integer()
      .min(1)
      .optional()
      .messages({
        'number.base': 'Maintenance type ID must be a number.',
        'number.integer': 'Maintenance type ID must be an integer.',
        'number.min': 'Maintenance type ID must be greater than 0.'
      }),
    is_active: Joi.boolean()
      .optional()
      .messages({
        'boolean.base': 'Is active must be a boolean value (true or false).'
      }),
    overdue: Joi.boolean()
      .optional()
      .messages({
        'boolean.base': 'Overdue must be a boolean value (true or false).'
      })
  })
});

export const scheduleIdSchema = Joi.object({
  params: Joi.object({
    id: Joi.number()
      .integer()
      .min(1)
      .required()
      .messages({
        'number.base': 'Schedule ID must be a number.',
        'number.integer': 'Schedule ID must be an integer.',
        'number.min': 'Schedule ID must be greater than 0.',
        'any.required': 'Schedule ID is required.'
      })
  })
});

export const daysSchema = Joi.object({
  params: Joi.object({
    days: Joi.number()
      .integer()
      .min(1)
      .max(365)
      .required()
      .messages({
        'number.base': 'Days must be a number.',
        'number.integer': 'Days must be an integer.',
        'number.min': 'Days must be at least 1.',
        'number.max': 'Days cannot exceed 365.',
        'any.required': 'Days parameter is required.'
      })
  })
});

export const machineIdSchema = Joi.object({
  params: Joi.object({
    machineId: Joi.number()
      .integer()
      .min(1)
      .required()
      .messages({
        'number.base': 'Machine ID must be a number.',
        'number.integer': 'Machine ID must be an integer.',
        'number.min': 'Machine ID must be greater than 0.',
        'any.required': 'Machine ID is required.'
      })
  })
});
