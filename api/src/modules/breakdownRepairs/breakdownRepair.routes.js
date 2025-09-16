import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { permissionMiddleware } from '../../middleware/permissionMiddleware.js';
import { activityLogger } from '../../middleware/activityLogger.js';
import { validate } from '../../middleware/validateRequest.js';
import { BreakdownRepairController } from './breakdownRepair.controller.js';
import { 
  createSchema, updateSchema, getByIdSchema, getByBreakdownSchema, deleteSchema,
  startSchema, completeSchema 
} from './breakdownRepair.validation.js';

const router = Router();

// Repair management routes
router.post('/breakdown/:breakdown_id/repairs', 
  authMiddleware, 
  permissionMiddleware('breakdown.repair.add'), 
  activityLogger('breakdown.repair.add'), 
  validate(createSchema), 
  BreakdownRepairController.create
);

router.get('/breakdown/:breakdown_id/repairs', 
  authMiddleware, 
  permissionMiddleware('breakdown.repair.list'), 
  validate(getByBreakdownSchema),
  BreakdownRepairController.getByBreakdownId
);

router.get('/repairs/:repair_id', 
  authMiddleware, 
  permissionMiddleware('breakdown.repair.view'), 
  validate(getByIdSchema),
  BreakdownRepairController.getById
);

router.put('/repairs/:repair_id', 
  authMiddleware, 
  permissionMiddleware('breakdown.repair.update'), 
  activityLogger('breakdown.repair.update'), 
  validate(updateSchema), 
  BreakdownRepairController.update
);

router.patch('/repairs/:repair_id/start', 
  authMiddleware, 
  permissionMiddleware('breakdown.repair.start'), 
  activityLogger('breakdown.repair.start'), 
  validate(startSchema), 
  BreakdownRepairController.start
);

router.patch('/repairs/:repair_id/complete', 
  authMiddleware, 
  permissionMiddleware('breakdown.repair.complete'), 
  activityLogger('breakdown.repair.complete'), 
  validate(completeSchema), 
  BreakdownRepairController.complete
);

router.delete('/repairs/:repair_id', 
  authMiddleware, 
  permissionMiddleware('breakdown.repair.delete'), 
  activityLogger('breakdown.repair.delete'), 
  validate(deleteSchema),
  BreakdownRepairController.remove
);

export default router;