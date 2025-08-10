import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { permissionMiddleware } from '../../middleware/permissionMiddleware.js';
import { activityLogger } from '../../middleware/activityLogger.js';
import { validate } from '../../middleware/validateRequest.js';
import { MachineController } from './machine.controller.js';
import { createSchema, updateSchema, listQuerySchema } from './machine.validation.js';

const router = Router();

router.post('/', authMiddleware, permissionMiddleware('machine.add'), activityLogger('machine.add'), validate(createSchema), MachineController.create);
router.get('/', authMiddleware, permissionMiddleware('machine.list'), validate(listQuerySchema), MachineController.list);
router.put('/:machine_id', authMiddleware, permissionMiddleware('machine.update'), activityLogger('machine.update'), validate(updateSchema), MachineController.update);
router.delete('/:machine_id', authMiddleware, permissionMiddleware('machine.delete'), activityLogger('machine.delete'), MachineController.remove);

export default router;
