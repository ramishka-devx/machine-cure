import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { permissionMiddleware } from '../../middleware/permissionMiddleware.js';
import { activityLogger } from '../../middleware/activityLogger.js';
import { validate } from '../../middleware/validateRequest.js';
import { ParameterController } from './parameter.controller.js';
import { createSchema, updateSchema } from './parameter.validation.js';

const router = Router();

router.post('/', authMiddleware, permissionMiddleware('parameter.add'), activityLogger('parameter.add'), validate(createSchema), ParameterController.create);
router.get('/', authMiddleware, permissionMiddleware('parameter.list'), ParameterController.list);
router.put('/:parameter_id', authMiddleware, permissionMiddleware('parameter.update'), activityLogger('parameter.update'), validate(updateSchema), ParameterController.update);
router.delete('/:parameter_id', authMiddleware, permissionMiddleware('parameter.delete'), activityLogger('parameter.delete'), ParameterController.remove);

export default router;
