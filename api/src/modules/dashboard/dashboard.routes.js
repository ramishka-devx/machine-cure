import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { permissionMiddleware } from '../../middleware/permissionMiddleware.js';
import { DashboardController } from './dashboard.controller.js';

const router = Router();

router.get('/metrics', 
  authMiddleware, 
  permissionMiddleware('dashboard.view'), 
  DashboardController.getMetrics
);

router.get('/critical-issues', 
  authMiddleware, 
  permissionMiddleware('dashboard.view'), 
  DashboardController.getCriticalIssues
);

router.get('/recent-activity', 
  authMiddleware, 
  permissionMiddleware('dashboard.view'), 
  DashboardController.getRecentActivity
);

export default router;