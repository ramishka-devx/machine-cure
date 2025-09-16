import { body, param } from 'express-validator';

const MaintenanceTypeValidation = {
  // Validation for creating maintenance type
  createMaintenanceType: [
    body('name')
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters')
      .trim(),
    
    body('description')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Description must not exceed 1000 characters')
      .trim(),
    
    body('default_frequency_days')
      .notEmpty()
      .withMessage('Default frequency days is required')
      .isInt({ min: 1, max: 3650 })
      .withMessage('Default frequency days must be between 1 and 3650 days'),
    
    body('estimated_duration_hours')
      .optional()
      .isFloat({ min: 0, max: 999.99 })
      .withMessage('Estimated duration hours must be between 0 and 999.99')
  ],

  // Validation for updating maintenance type
  updateMaintenanceType: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Valid maintenance type ID is required'),
    
    body('name')
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters')
      .trim(),
    
    body('description')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Description must not exceed 1000 characters')
      .trim(),
    
    body('default_frequency_days')
      .notEmpty()
      .withMessage('Default frequency days is required')
      .isInt({ min: 1, max: 3650 })
      .withMessage('Default frequency days must be between 1 and 3650 days'),
    
    body('estimated_duration_hours')
      .optional()
      .isFloat({ min: 0, max: 999.99 })
      .withMessage('Estimated duration hours must be between 0 and 999.99')
  ],

  // Validation for maintenance type ID parameter
  maintenanceTypeId: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Valid maintenance type ID is required')
  ]
};

export default MaintenanceTypeValidation;