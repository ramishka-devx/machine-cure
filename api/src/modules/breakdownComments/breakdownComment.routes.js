import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { permissionMiddleware } from '../../middleware/permissionMiddleware.js';
import { activityLogger } from '../../middleware/activityLogger.js';
import { validate } from '../../middleware/validateRequest.js';
import { BreakdownCommentController } from './breakdownComment.controller.js';
import { 
  createSchema, updateSchema, getByIdSchema, getByBreakdownSchema, deleteSchema
} from './breakdownComment.validation.js';

const router = Router();

router.post('/breakdown/:breakdown_id/comments', 
  authMiddleware, 
  permissionMiddleware('breakdown.comment.add'), 
  activityLogger('breakdown.comment.add'), 
  validate(createSchema), 
  BreakdownCommentController.create
);

router.get('/breakdown/:breakdown_id/comments', 
  authMiddleware, 
  permissionMiddleware('breakdown.comment.list'), 
  validate(getByBreakdownSchema),
  BreakdownCommentController.getByBreakdownId
);

router.get('/comments/:comment_id', 
  authMiddleware, 
  permissionMiddleware('breakdown.comment.view'), 
  validate(getByIdSchema),
  BreakdownCommentController.getById
);

router.put('/comments/:comment_id', 
  authMiddleware, 
  permissionMiddleware('breakdown.comment.update'), 
  activityLogger('breakdown.comment.update'), 
  validate(updateSchema), 
  BreakdownCommentController.update
);

router.delete('/comments/:comment_id', 
  authMiddleware, 
  permissionMiddleware('breakdown.comment.delete'), 
  activityLogger('breakdown.comment.delete'), 
  validate(deleteSchema),
  BreakdownCommentController.remove
);

export default router;