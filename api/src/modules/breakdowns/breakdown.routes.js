import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { permissionMiddleware } from '../../middleware/permissionMiddleware.js';
import { activityLogger } from '../../middleware/activityLogger.js';
import { validate } from '../../middleware/validateRequest.js';
import { BreakdownController } from './breakdown.controller.js';
import { 
  createSchema, updateSchema, getByIdSchema, deleteSchema, listSchema,
  updateStatusSchema, assignSchema, startRepairSchema, completeRepairSchema 
} from './breakdown.validation.js';

const router = Router();

// Main CRUD routes
router.post('/', 
  authMiddleware, 
  permissionMiddleware('breakdown.add'), 
  activityLogger('breakdown.add'), 
  validate(createSchema), 
  BreakdownController.create
);

router.get('/', 
  authMiddleware, 
  permissionMiddleware('breakdown.list'), 
  validate(listSchema),
  BreakdownController.list
);

router.get('/:breakdown_id', 
  authMiddleware, 
  permissionMiddleware('breakdown.view'), 
  validate(getByIdSchema),
  BreakdownController.getById
);

router.put('/:breakdown_id', 
  authMiddleware, 
  permissionMiddleware('breakdown.update'), 
  activityLogger('breakdown.update'), 
  validate(updateSchema), 
  BreakdownController.update
);

router.delete('/:breakdown_id', 
  authMiddleware, 
  permissionMiddleware('breakdown.delete'), 
  activityLogger('breakdown.delete'), 
  validate(deleteSchema),
  BreakdownController.remove
);

// Status management routes
router.patch('/:breakdown_id/status', 
  authMiddleware, 
  permissionMiddleware('breakdown.updateStatus'), 
  activityLogger('breakdown.updateStatus'), 
  validate(updateStatusSchema), 
  BreakdownController.updateStatus
);

router.patch('/:breakdown_id/assign', 
  authMiddleware, 
  permissionMiddleware('breakdown.assign'), 
  activityLogger('breakdown.assign'), 
  validate(assignSchema), 
  BreakdownController.assign
);

router.patch('/:breakdown_id/start-repair', 
  authMiddleware, 
  permissionMiddleware('breakdown.startRepair'), 
  activityLogger('breakdown.startRepair'), 
  validate(startRepairSchema), 
  BreakdownController.startRepair
);

router.patch('/:breakdown_id/complete-repair', 
  authMiddleware, 
  permissionMiddleware('breakdown.completeRepair'), 
  activityLogger('breakdown.completeRepair'), 
  validate(completeRepairSchema), 
  BreakdownController.completeRepair
);

export default router;