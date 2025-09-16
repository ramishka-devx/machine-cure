import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { permissionMiddleware } from '../../middleware/permissionMiddleware.js';
import { activityLogger } from '../../middleware/activityLogger.js';
import { validate } from '../../middleware/validateRequest.js';
import { BreakdownCategoryController } from './breakdownCategory.controller.js';
import { createSchema, updateSchema, getByIdSchema, deleteSchema } from './breakdownCategory.validation.js';

const router = Router();

router.post('/', 
  authMiddleware, 
  permissionMiddleware('breakdownCategory.add'), 
  activityLogger('breakdownCategory.add'), 
  validate(createSchema), 
  BreakdownCategoryController.create
);

router.get('/', 
  authMiddleware, 
  permissionMiddleware('breakdownCategory.list'), 
  BreakdownCategoryController.list
);

router.get('/with-counts', 
  authMiddleware, 
  permissionMiddleware('breakdownCategory.list'), 
  BreakdownCategoryController.getWithBreakdownCount
);

router.get('/:category_id', 
  authMiddleware, 
  permissionMiddleware('breakdownCategory.view'), 
  validate(getByIdSchema),
  BreakdownCategoryController.getById
);

router.put('/:category_id', 
  authMiddleware, 
  permissionMiddleware('breakdownCategory.update'), 
  activityLogger('breakdownCategory.update'), 
  validate(updateSchema), 
  BreakdownCategoryController.update
);

router.delete('/:category_id', 
  authMiddleware, 
  permissionMiddleware('breakdownCategory.delete'), 
  activityLogger('breakdownCategory.delete'), 
  validate(deleteSchema),
  BreakdownCategoryController.remove
);

export default router;