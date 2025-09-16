import express from 'express';
import MaintenanceScheduleController from './maintenanceSchedule.controller.js';
import { createSchema, updateSchema, listQuerySchema, scheduleIdSchema, daysSchema, machineIdSchema } from './maintenanceSchedule.validations.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { permissionMiddleware } from '../../middleware/permissionMiddleware.js';
import { activityLogger } from '../../middleware/activityLogger.js';
import { validate } from '../../middleware/validateRequest.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

router.get(
  '/',
  validate(listQuerySchema),
  permissionMiddleware('maintenance_schedules.read'),
  MaintenanceScheduleController.getAllMaintenanceSchedules
);

router.get(
  '/overdue',
  permissionMiddleware('maintenance_schedules.read'),
  MaintenanceScheduleController.getOverdueSchedules
);

router.get(
  '/due-within/:days',
  validate(daysSchema),
  permissionMiddleware('maintenance_schedules.read'),
  MaintenanceScheduleController.getSchedulesDueWithin
);

router.get(
  '/machine/:machineId',
  validate(machineIdSchema),
  permissionMiddleware('maintenance_schedules.read'),
  MaintenanceScheduleController.getSchedulesByMachine
);

router.get(
  '/:id',
  validate(scheduleIdSchema),
  permissionMiddleware('maintenance_schedules.read'),
  MaintenanceScheduleController.getMaintenanceScheduleById
);

router.post(
  '/',
  validate(createSchema),
  permissionMiddleware('maintenance_schedules.create'),
  activityLogger('maintenance_schedule.create'),
  MaintenanceScheduleController.createMaintenanceSchedule
);

router.put(
  '/:id',
  validate(updateSchema),
  permissionMiddleware('maintenance_schedules.update'),
  activityLogger('maintenance_schedule.update'),
  MaintenanceScheduleController.updateMaintenanceSchedule
);

router.post(
  '/:id/complete',
  validate(scheduleIdSchema),
  permissionMiddleware('maintenance_schedules.update'),
  activityLogger('maintenance_schedule.complete'),
  MaintenanceScheduleController.completeMaintenanceSchedule
);

router.delete(
  '/:id',
  validate(scheduleIdSchema),
  permissionMiddleware('maintenance_schedules.delete'),
  activityLogger('maintenance_schedule.delete'),
  MaintenanceScheduleController.deleteMaintenanceSchedule
);

export default router;
