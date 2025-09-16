import { success } from '../../utils/apiResponse.js';
import { BreakdownRepairService } from './breakdownRepair.service.js';

export const BreakdownRepairController = {
  async create(req, res, next) { 
    try { 
      const data = await BreakdownRepairService.create(
        Number(req.params.breakdown_id), 
        req.body, 
        req.user.user_id
      ); 
      return success(res, data, 'Repair task created successfully', 201);
    } catch (e) { 
      next(e);
    } 
  },

  async getByBreakdownId(req, res, next) { 
    try { 
      const data = await BreakdownRepairService.getByBreakdownId(Number(req.params.breakdown_id)); 
      return success(res, data);
    } catch (e) { 
      next(e);
    } 
  },

  async getById(req, res, next) { 
    try { 
      const data = await BreakdownRepairService.getById(Number(req.params.repair_id)); 
      if (!data) {
        return res.status(404).json({ message: 'Repair task not found' });
      }
      return success(res, data);
    } catch (e) { 
      next(e);
    } 
  },

  async update(req, res, next) { 
    try { 
      const data = await BreakdownRepairService.update(Number(req.params.repair_id), req.body); 
      if (!data) {
        return res.status(404).json({ message: 'Repair task not found' });
      }
      return success(res, data, 'Repair task updated successfully');
    } catch (e) { 
      next(e);
    } 
  },

  async start(req, res, next) { 
    try { 
      const data = await BreakdownRepairService.start(
        Number(req.params.repair_id), 
        req.user.user_id
      ); 
      if (!data) {
        return res.status(404).json({ message: 'Repair task not found' });
      }
      return success(res, data, 'Repair task started successfully');
    } catch (e) { 
      next(e);
    } 
  },

  async complete(req, res, next) { 
    try { 
      const data = await BreakdownRepairService.complete(
        Number(req.params.repair_id), 
        req.user.user_id,
        req.body
      ); 
      if (!data) {
        return res.status(404).json({ message: 'Repair task not found' });
      }
      return success(res, data, 'Repair task completed successfully');
    } catch (e) { 
      next(e);
    } 
  },

  async remove(req, res, next) { 
    try { 
      await BreakdownRepairService.remove(Number(req.params.repair_id)); 
      return success(res, null, 'Repair task deleted successfully', 204);
    } catch (e) { 
      next(e);
    } 
  }
};