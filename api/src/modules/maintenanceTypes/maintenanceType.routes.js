import express from 'express';
import MaintenanceTypeController from './maintenanceType.controller.js';
import MaintenanceTypeValidation from './maintenanceType.validation.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { permissionMiddleware } from '../../middleware/permissionMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

/**
 * @swagger
 * components:
 *   schemas:
 *     MaintenanceType:
 *       type: object
 *       required:
 *         - name
 *         - default_frequency_days
 *       properties:
 *         maintenance_type_id:
 *           type: integer
 *           description: The auto-generated id of the maintenance type
 *         name:
 *           type: string
 *           maxLength: 100
 *           description: Name of the maintenance type
 *         description:
 *           type: string
 *           description: Description of the maintenance type
 *         default_frequency_days:
 *           type: integer
 *           minimum: 1
 *           maximum: 3650
 *           description: Default frequency in days
 *         estimated_duration_hours:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 999.99
 *           description: Estimated duration in hours
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/maintenance-types:
 *   get:
 *     summary: Get all maintenance types
 *     tags: [Maintenance Types]
 *     parameters:
 *       - in: query
 *         name: include_stats
 *         schema:
 *           type: boolean
 *         description: Include usage statistics
 *     responses:
 *       200:
 *         description: List of maintenance types
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MaintenanceType'
 */
router.get('/', 
  permissionMiddleware('maintenance_types.read'),
  MaintenanceTypeController.getAllMaintenanceTypes
);

/**
 * @swagger
 * /api/maintenance-types/{id}:
 *   get:
 *     summary: Get maintenance type by ID
 *     tags: [Maintenance Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Maintenance type details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/MaintenanceType'
 *       404:
 *         description: Maintenance type not found
 */
router.get('/:id', 
  MaintenanceTypeValidation.maintenanceTypeId,
  permissionMiddleware('maintenance_types.read'),
  MaintenanceTypeController.getMaintenanceTypeById
);

/**
 * @swagger
 * /api/maintenance-types:
 *   post:
 *     summary: Create a new maintenance type
 *     tags: [Maintenance Types]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - default_frequency_days
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *               description:
 *                 type: string
 *               default_frequency_days:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 3650
 *               estimated_duration_hours:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 999.99
 *     responses:
 *       201:
 *         description: Maintenance type created successfully
 *       409:
 *         description: Maintenance type name already exists
 */
router.post('/', 
  MaintenanceTypeValidation.createMaintenanceType,
  permissionMiddleware('maintenance_types.create'),
  MaintenanceTypeController.createMaintenanceType
);

/**
 * @swagger
 * /api/maintenance-types/{id}:
 *   put:
 *     summary: Update maintenance type
 *     tags: [Maintenance Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - default_frequency_days
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *               description:
 *                 type: string
 *               default_frequency_days:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 3650
 *               estimated_duration_hours:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 999.99
 *     responses:
 *       200:
 *         description: Maintenance type updated successfully
 *       404:
 *         description: Maintenance type not found
 *       409:
 *         description: Maintenance type name already exists
 */
router.put('/:id', 
  MaintenanceTypeValidation.updateMaintenanceType,
  permissionMiddleware('maintenance_types.update'),
  MaintenanceTypeController.updateMaintenanceType
);

/**
 * @swagger
 * /api/maintenance-types/{id}:
 *   delete:
 *     summary: Delete maintenance type
 *     tags: [Maintenance Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Maintenance type deleted successfully
 *       404:
 *         description: Maintenance type not found
 *       409:
 *         description: Cannot delete maintenance type that is being used
 */
router.delete('/:id', 
  MaintenanceTypeValidation.maintenanceTypeId,
  permissionMiddleware('maintenance_types.delete'),
  MaintenanceTypeController.deleteMaintenanceType
);

export default router;