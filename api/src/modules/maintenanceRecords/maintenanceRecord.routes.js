import express from 'express';
import MaintenanceRecordController from './maintenanceRecord.controller.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { permissionMiddleware } from '../../middleware/permissionMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get all maintenance records
router.get('/', 
  permissionMiddleware('maintenance_records.read'),
  MaintenanceRecordController.getAllMaintenanceRecords
);

// Get upcoming maintenance for current user
router.get('/upcoming', 
  permissionMiddleware('maintenance_records.read'),
  MaintenanceRecordController.getUpcomingMaintenanceForUser
);

// Get maintenance statistics
router.get('/statistics', 
  permissionMiddleware('maintenance_records.read'),
  MaintenanceRecordController.getMaintenanceStatistics
);

// Get maintenance records by machine
router.get('/machine/:machineId', 
  permissionMiddleware('maintenance_records.read'),
  MaintenanceRecordController.getMaintenanceRecordsByMachine
);

// Get maintenance record by ID
router.get('/:id', 
  permissionMiddleware('maintenance_records.read'),
  MaintenanceRecordController.getMaintenanceRecordById
);

// Create new maintenance record
router.post('/', 
  permissionMiddleware('maintenance_records.create'),
  MaintenanceRecordController.createMaintenanceRecord
);

// Start maintenance work
router.post('/:id/start', 
  permissionMiddleware('maintenance_records.update'),
  MaintenanceRecordController.startMaintenanceWork
);

// Complete maintenance work
router.post('/:id/complete', 
  permissionMiddleware('maintenance_records.update'),
  MaintenanceRecordController.completeMaintenanceWork
);

// Update maintenance record
router.put('/:id', 
  permissionMiddleware('maintenance_records.update'),
  MaintenanceRecordController.updateMaintenanceRecord
);

// Delete maintenance record
router.delete('/:id', 
  permissionMiddleware('maintenance_records.delete'),
  MaintenanceRecordController.deleteMaintenanceRecord
);

export default router;