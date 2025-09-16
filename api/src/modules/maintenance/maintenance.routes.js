import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { permissionMiddleware } from '../../middleware/permissionMiddleware.js';
import { activityLogger } from '../../middleware/activityLogger.js';
import { validate } from '../../middleware/validateRequest.js';
import { MaintenanceController } from './maintenance.controller.js';
import { createSchema, updateSchema, listQuerySchema, updateStatusSchema } from './maintenance.validation.js';

const router = Router();

// Main CRUD operations
router.post('/', 
  authMiddleware, 
  permissionMiddleware('maintenance.add'), 
  activityLogger('maintenance.add'), 
  validate(createSchema), 
  MaintenanceController.create
);

router.get('/', 
  authMiddleware, 
  permissionMiddleware('maintenance.list'), 
  validate(listQuerySchema), 
  MaintenanceController.list
);

router.put('/:maintenance_id', 
  authMiddleware, 
  permissionMiddleware('maintenance.update'), 
  activityLogger('maintenance.update'), 
  validate(updateSchema), 
  MaintenanceController.update
);

router.delete('/:maintenance_id', 
  authMiddleware, 
  permissionMiddleware('maintenance.delete'), 
  activityLogger('maintenance.delete'), 
  MaintenanceController.remove
);

// Status management
router.put('/:maintenance_id/status', 
  authMiddleware, 
  permissionMiddleware('maintenance.status.update'), 
  activityLogger('maintenance.status.update'), 
  validate(updateStatusSchema), 
  MaintenanceController.updateStatus
);

export default router;