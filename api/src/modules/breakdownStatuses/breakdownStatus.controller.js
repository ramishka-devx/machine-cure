import { success } from '../../utils/apiResponse.js';
import { BreakdownStatusService } from './breakdownStatus.service.js';

export const BreakdownStatusController = {
  async create(req, res, next) { 
    try { 
      const data = await BreakdownStatusService.create(req.body); 
      return success(res, data, 'Breakdown status created', 201);
    } catch (e) { 
      next(e);
    } 
  },

  async list(req, res, next) { 
    try { 
      const data = await BreakdownStatusService.list(); 
      return success(res, data);
    } catch (e) { 
      next(e);
    } 
  },

  async getById(req, res, next) { 
    try { 
      const data = await BreakdownStatusService.getById(Number(req.params.status_id)); 
      if (!data) {
        return res.status(404).json({ message: 'Breakdown status not found' });
      }
      return success(res, data);
    } catch (e) { 
      next(e);
    } 
  },

  async update(req, res, next) { 
    try { 
      const data = await BreakdownStatusService.update(Number(req.params.status_id), req.body); 
      if (!data) {
        return res.status(404).json({ message: 'Breakdown status not found' });
      }
      return success(res, data, 'Breakdown status updated');
    } catch (e) { 
      next(e);
    } 
  },

  async remove(req, res, next) { 
    try { 
      await BreakdownStatusService.remove(Number(req.params.status_id)); 
      return success(res, null, 'Breakdown status deleted', 204);
    } catch (e) { 
      next(e);
    } 
  },

  async getWithBreakdownCount(req, res, next) { 
    try { 
      const data = await BreakdownStatusService.getWithBreakdownCount(); 
      return success(res, data);
    } catch (e) { 
      next(e);
    } 
  }
};