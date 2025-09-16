import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { permissionMiddleware } from '../../middleware/permissionMiddleware.js';
import { activityLogger } from '../../middleware/activityLogger.js';
import { validate } from '../../middleware/validateRequest.js';
import { BreakdownStatusController } from './breakdownStatus.controller.js';
import { createSchema, updateSchema, getByIdSchema, deleteSchema } from './breakdownStatus.validation.js';

const router = Router();

router.post('/', 
  authMiddleware, 
  permissionMiddleware('breakdownStatus.add'), 
  activityLogger('breakdownStatus.add'), 
  validate(createSchema), 
  BreakdownStatusController.create
);

router.get('/', 
  authMiddleware, 
  permissionMiddleware('breakdownStatus.list'), 
  BreakdownStatusController.list
);

router.get('/with-counts', 
  authMiddleware, 
  permissionMiddleware('breakdownStatus.list'), 
  BreakdownStatusController.getWithBreakdownCount
);

router.get('/:status_id', 
  authMiddleware, 
  permissionMiddleware('breakdownStatus.view'), 
  validate(getByIdSchema),
  BreakdownStatusController.getById
);

router.put('/:status_id', 
  authMiddleware, 
  permissionMiddleware('breakdownStatus.update'), 
  activityLogger('breakdownStatus.update'), 
  validate(updateSchema), 
  BreakdownStatusController.update
);

router.delete('/:status_id', 
  authMiddleware, 
  permissionMiddleware('breakdownStatus.delete'), 
  activityLogger('breakdownStatus.delete'), 
  validate(deleteSchema),
  BreakdownStatusController.remove
);

export default router;