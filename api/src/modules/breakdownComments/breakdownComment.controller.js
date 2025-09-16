import { success } from '../../utils/apiResponse.js';
import { BreakdownCommentService } from './breakdownComment.service.js';

export const BreakdownCommentController = {
  async create(req, res, next) { 
    try { 
      const data = await BreakdownCommentService.create(
        Number(req.params.breakdown_id), 
        req.body, 
        req.user.user_id
      ); 
      return success(res, data, 'Comment added successfully', 201);
    } catch (e) { 
      next(e);
    } 
  },

  async getByBreakdownId(req, res, next) { 
    try { 
      const data = await BreakdownCommentService.getByBreakdownId(
        Number(req.params.breakdown_id),
        req.query.include_internal
      ); 
      return success(res, data);
    } catch (e) { 
      next(e);
    } 
  },

  async getById(req, res, next) { 
    try { 
      const data = await BreakdownCommentService.getById(Number(req.params.comment_id)); 
      if (!data) {
        return res.status(404).json({ message: 'Comment not found' });
      }
      return success(res, data);
    } catch (e) { 
      next(e);
    } 
  },

  async update(req, res, next) { 
    try { 
      const data = await BreakdownCommentService.update(Number(req.params.comment_id), req.body); 
      if (!data) {
        return res.status(404).json({ message: 'Comment not found' });
      }
      return success(res, data, 'Comment updated successfully');
    } catch (e) { 
      next(e);
    } 
  },

  async remove(req, res, next) { 
    try { 
      await BreakdownCommentService.remove(Number(req.params.comment_id)); 
      return success(res, null, 'Comment deleted successfully', 204);
    } catch (e) { 
      next(e);
    } 
  }
};