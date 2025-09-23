import { success } from '../../utils/apiResponse.js';
import { BreakdownService } from './breakdown.service.js';
import { NotificationService } from '../notifications/notification.service.js';

export const BreakdownController = {
  async create(req, res, next) { 
    try { 
      const data = await BreakdownService.create(req.body, req.user.user_id); 
      return success(res, data, 'Breakdown reported successfully', 201);
    } catch (e) { 
      next(e);
    } 
  },

  async list(req, res, next) { 
    try { 
      const data = await BreakdownService.list(req.query); 
      return success(res, data);
    } catch (e) { 
      next(e);
    } 
  },

  async getById(req, res, next) { 
    try { 
      const data = await BreakdownService.getById(Number(req.params.breakdown_id)); 
      if (!data) {
        return res.status(404).json({ message: 'Breakdown not found' });
      }
      return success(res, data);
    } catch (e) { 
      next(e);
    } 
  },

  async update(req, res, next) { 
    try { 
      const data = await BreakdownService.update(Number(req.params.breakdown_id), req.body); 
      if (!data) {
        return res.status(404).json({ message: 'Breakdown not found' });
      }
      return success(res, data, 'Breakdown updated successfully');
    } catch (e) { 
      next(e);
    } 
  },

  async updateStatus(req, res, next) { 
    try { 
      const data = await BreakdownService.updateStatus(
        Number(req.params.breakdown_id), 
        req.body.status_id, 
        req.user.user_id
      ); 
      if (!data) {
        return res.status(404).json({ message: 'Breakdown not found' });
      }
      return success(res, data, 'Breakdown status updated successfully');
    } catch (e) { 
      next(e);
    } 
  },

  async assign(req, res, next) { 
    try { 
      const data = await BreakdownService.assign(
        Number(req.params.breakdown_id), 
        req.body.assigned_to, 
        req.user.user_id
      ); 
      if (!data) {
        return res.status(404).json({ message: 'Breakdown not found' });
      }

      // Create notification for the assigned user
      try {
        await NotificationService.createNotification(
          req.body.assigned_to,
          'breakdown_assigned',
          'Breakdown Assigned',
          `You have been assigned to repair breakdown #${req.params.breakdown_id}`,
          'breakdown',
          Number(req.params.breakdown_id),
          'high'
        );
      } catch (notificationError) {
        console.error('Failed to create notification:', notificationError);
        // Don't fail the request if notification fails
      }

      return success(res, data, 'Breakdown assigned successfully');
    } catch (e) { 
      next(e);
    } 
  },

  async startRepair(req, res, next) { 
    try { 
      const data = await BreakdownService.startRepair(
        Number(req.params.breakdown_id), 
        req.user.user_id
      ); 
      if (!data) {
        return res.status(404).json({ message: 'Breakdown not found' });
      }
      return success(res, data, 'Repair started successfully');
    } catch (e) { 
      next(e);
    } 
  },

  async completeRepair(req, res, next) { 
    try { 
      const data = await BreakdownService.completeRepair(
        Number(req.params.breakdown_id), 
        req.user.user_id,
        req.body
      ); 
      if (!data) {
        return res.status(404).json({ message: 'Breakdown not found' });
      }
      return success(res, data, 'Repair completed successfully');
    } catch (e) { 
      next(e);
    } 
  },

  async remove(req, res, next) { 
    try { 
      await BreakdownService.remove(Number(req.params.breakdown_id)); 
      return success(res, null, 'Breakdown deleted successfully', 204);
    } catch (e) { 
      next(e);
    } 
  }
};