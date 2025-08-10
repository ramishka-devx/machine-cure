import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { permissionMiddleware } from '../../middleware/permissionMiddleware.js';
import { activityLogger } from '../../middleware/activityLogger.js';
import { validate } from '../../middleware/validateRequest.js';
import { DivisionController } from './division.controller.js';
import { createSchema, updateSchema } from './division.validation.js';

const router = Router();

router.post('/', authMiddleware, permissionMiddleware('division.add'), activityLogger('division.add'), validate(createSchema), DivisionController.create);
router.get('/', authMiddleware, permissionMiddleware('division.list'), DivisionController.list);
router.put('/:division_id', authMiddleware, permissionMiddleware('division.update'), activityLogger('division.update'), validate(updateSchema), DivisionController.update);
router.delete('/:division_id', authMiddleware, permissionMiddleware('division.delete'), activityLogger('division.delete'), DivisionController.remove);

export default router;
