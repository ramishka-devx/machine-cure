import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { permissionMiddleware } from '../../middleware/permissionMiddleware.js';
import { activityLogger } from '../../middleware/activityLogger.js';
import { validate } from '../../middleware/validateRequest.js';
import { MeterController } from './meter.controller.js';
import { createSchema, updateSchema } from './meter.validation.js';

const router = Router();

router.post('/', authMiddleware, permissionMiddleware('meter.add'), activityLogger('meter.add'), validate(createSchema), MeterController.create);
router.get('/', authMiddleware, permissionMiddleware('meter.list'), MeterController.list);
router.put('/:meter_id', authMiddleware, permissionMiddleware('meter.update'), activityLogger('meter.update'), validate(updateSchema), MeterController.update);
router.delete('/:meter_id', authMiddleware, permissionMiddleware('meter.delete'), activityLogger('meter.delete'), MeterController.remove);

export default router;
