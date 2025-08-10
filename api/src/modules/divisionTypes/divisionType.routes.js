import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { permissionMiddleware } from '../../middleware/permissionMiddleware.js';
import { activityLogger } from '../../middleware/activityLogger.js';
import { validate } from '../../middleware/validateRequest.js';
import { DivisionTypeController } from './divisionType.controller.js';
import { createSchema, updateSchema } from './divisionType.validation.js';

const router = Router();

router.post('/', authMiddleware, permissionMiddleware('divisionType.add'), activityLogger('divisionType.add'), validate(createSchema), DivisionTypeController.create);
router.get('/', authMiddleware, permissionMiddleware('divisionType.list'), DivisionTypeController.list);
router.put('/:division_type_id', authMiddleware, permissionMiddleware('divisionType.update'), activityLogger('divisionType.update'), validate(updateSchema), DivisionTypeController.update);
router.delete('/:division_type_id', authMiddleware, permissionMiddleware('divisionType.delete'), activityLogger('divisionType.delete'), DivisionTypeController.remove);

export default router;
