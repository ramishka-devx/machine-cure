import express from 'express';
import PartController from './part.controller.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { permissionMiddleware } from '../../middleware/permissionMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get all parts
router.get('/', 
  permissionMiddleware('parts.read'),
  PartController.getAllParts
);

// Get low stock parts
router.get('/low-stock', 
  permissionMiddleware('parts.read'),
  PartController.getLowStockParts
);

// Get parts by category
router.get('/categories', 
  permissionMiddleware('parts.read'),
  PartController.getPartsByCategory
);

// Get inventory value
router.get('/inventory-value', 
  permissionMiddleware('parts.read'),
  PartController.getInventoryValue
);

// Search parts
router.get('/search', 
  permissionMiddleware('parts.read'),
  PartController.searchParts
);

// Get parts for machine
router.get('/machine/:machineId', 
  permissionMiddleware('parts.read'),
  PartController.getPartsForMachine
);

// Get part usage history
router.get('/:id/usage-history', 
  permissionMiddleware('parts.read'),
  PartController.getPartUsageHistory
);

// Get part by ID
router.get('/:id', 
  permissionMiddleware('parts.read'),
  PartController.getPartById
);

// Create new part
router.post('/', 
  permissionMiddleware('parts.create'),
  PartController.createPart
);

// Record part usage
router.post('/usage', 
  permissionMiddleware('parts.update'),
  PartController.recordPartUsage
);

// Update part stock
router.patch('/:id/stock', 
  permissionMiddleware('parts.update'),
  PartController.updatePartStock
);

// Update part
router.put('/:id', 
  permissionMiddleware('parts.update'),
  PartController.updatePart
);

// Delete part
router.delete('/:id', 
  permissionMiddleware('parts.delete'),
  PartController.deletePart
);

export default router;