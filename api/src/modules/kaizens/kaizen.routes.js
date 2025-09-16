import express from 'express';
import { KaizenController } from './kaizen.controller.js';
import { validate } from '../../middleware/validateRequest.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { permissionMiddleware } from '../../middleware/permissionMiddleware.js';
import {
  createSchema,
  updateSchema,
  listQuerySchema,
  updateStatusSchema,
  assignSchema,
  addCommentSchema,
  kaizenIdSchema
} from './kaizen.validation.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Stats endpoint (before parameterized routes)
router.get('/stats', 
  permissionMiddleware('kaizen.report'),
  KaizenController.getStats
);

// Categories and statuses
router.get('/categories', 
  permissionMiddleware('kaizen.view'),
  KaizenController.getCategories
);

router.get('/statuses', 
  permissionMiddleware('kaizen.view'),
  KaizenController.getStatuses
);

// Main CRUD operations
router.post('/',
  permissionMiddleware('kaizen.create'),
  validate(createSchema),
  KaizenController.create
);

router.get('/',
  permissionMiddleware('kaizen.view'),
  validate(listQuerySchema),
  KaizenController.list
);

router.get('/:kaizen_id',
  permissionMiddleware('kaizen.view'),
  validate(kaizenIdSchema),
  KaizenController.findById
);

router.patch('/:kaizen_id',
  permissionMiddleware('kaizen.update'),
  validate(updateSchema),
  KaizenController.update
);

router.delete('/:kaizen_id',
  permissionMiddleware('kaizen.delete'),
  validate(kaizenIdSchema),
  KaizenController.remove
);

// Status management
router.patch('/:kaizen_id/status',
  permissionMiddleware('kaizen.approve'),
  validate(updateStatusSchema),
  KaizenController.updateStatus
);

// Assignment
router.patch('/:kaizen_id/assign',
  permissionMiddleware('kaizen.assign'),
  validate(assignSchema),
  KaizenController.assign
);

// Comments
router.get('/:kaizen_id/comments',
  permissionMiddleware('kaizen.view'),
  validate(kaizenIdSchema),
  KaizenController.getComments
);

router.post('/:kaizen_id/comments',
  permissionMiddleware('kaizen.comment'),
  validate(addCommentSchema),
  KaizenController.addComment
);

// History
router.get('/:kaizen_id/history',
  permissionMiddleware('kaizen.view'),
  validate(kaizenIdSchema),
  KaizenController.getHistory
);

export default router;