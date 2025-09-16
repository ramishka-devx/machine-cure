import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { permissionMiddleware } from '../../middleware/permissionMiddleware.js';
import { BreakdownAnalyticsController } from './breakdownAnalytics.controller.js';

const router = Router();

router.get('/summary', 
  authMiddleware, 
  permissionMiddleware('breakdown.analytics.view'), 
  BreakdownAnalyticsController.getSummary
);

router.get('/by-machine', 
  authMiddleware, 
  permissionMiddleware('breakdown.analytics.view'), 
  BreakdownAnalyticsController.getByMachine
);

router.get('/by-category', 
  authMiddleware, 
  permissionMiddleware('breakdown.analytics.view'), 
  BreakdownAnalyticsController.getByCategory
);

router.get('/by-division', 
  authMiddleware, 
  permissionMiddleware('breakdown.analytics.view'), 
  BreakdownAnalyticsController.getByDivision
);

router.get('/trends', 
  authMiddleware, 
  permissionMiddleware('breakdown.analytics.view'), 
  BreakdownAnalyticsController.getTrends
);

router.get('/mtbf', 
  authMiddleware, 
  permissionMiddleware('breakdown.analytics.view'), 
  BreakdownAnalyticsController.getMTBF
);

router.get('/mttr', 
  authMiddleware, 
  permissionMiddleware('breakdown.analytics.view'), 
  BreakdownAnalyticsController.getMTTR
);

router.get('/problematic-machines', 
  authMiddleware, 
  permissionMiddleware('breakdown.analytics.view'), 
  BreakdownAnalyticsController.getProblematicMachines
);

export default router;