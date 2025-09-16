import { success } from '../../utils/apiResponse.js';
import { BreakdownCategoryService } from './breakdownCategory.service.js';

export const BreakdownCategoryController = {
  async create(req, res, next) { 
    try { 
      const data = await BreakdownCategoryService.create(req.body); 
      return success(res, data, 'Breakdown category created', 201);
    } catch (e) { 
      next(e);
    } 
  },

  async list(req, res, next) { 
    try { 
      const data = await BreakdownCategoryService.list(); 
      return success(res, data);
    } catch (e) { 
      next(e);
    } 
  },

  async getById(req, res, next) { 
    try { 
      const data = await BreakdownCategoryService.getById(Number(req.params.category_id)); 
      if (!data) {
        return res.status(404).json({ message: 'Breakdown category not found' });
      }
      return success(res, data);
    } catch (e) { 
      next(e);
    } 
  },

  async update(req, res, next) { 
    try { 
      const data = await BreakdownCategoryService.update(Number(req.params.category_id), req.body); 
      if (!data) {
        return res.status(404).json({ message: 'Breakdown category not found' });
      }
      return success(res, data, 'Breakdown category updated');
    } catch (e) { 
      next(e);
    } 
  },

  async remove(req, res, next) { 
    try { 
      await BreakdownCategoryService.remove(Number(req.params.category_id)); 
      return success(res, null, 'Breakdown category deleted', 204);
    } catch (e) { 
      next(e);
    } 
  },

  async getWithBreakdownCount(req, res, next) { 
    try { 
      const data = await BreakdownCategoryService.getWithBreakdownCount(); 
      return success(res, data);
    } catch (e) { 
      next(e);
    } 
  }
};