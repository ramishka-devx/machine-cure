import { success } from '../../utils/apiResponse.js';
import { MaintenanceService } from './maintenance.service.js';

export const MaintenanceController = {
  async create(req, res, next) {
    try {
      const data = await MaintenanceService.create(req.body, req.user.user_id);
      return success(res, data, 'Maintenance scheduled successfully', 201);
    } catch (e) {
      next(e);
    }
  },

  async list(req, res, next) {
    try {
      const { page = 1, limit = 10, machine_id, type, status, priority, scheduled_by, q } = req.query;
      const data = await MaintenanceService.list({
        page: Number(page),
        limit: Number(limit),
        machine_id: machine_id !== undefined ? Number(machine_id) : undefined,
        type: type?.toString().trim() || undefined,
        status: status?.toString().trim() || undefined,
        priority: priority?.toString().trim() || undefined,
        scheduled_by: scheduled_by !== undefined ? Number(scheduled_by) : undefined,
        q: q?.toString().trim() || undefined
      });
      return success(res, data);
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const data = await MaintenanceService.update(Number(req.params.maintenance_id), req.body);
      if (!data) {
        return res.status(404).json({ message: 'Maintenance not found' });
      }
      return success(res, data, 'Maintenance updated successfully');
    } catch (e) {
      next(e);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const data = await MaintenanceService.updateStatus(
        Number(req.params.maintenance_id), 
        req.body.status
      );
      if (!data) {
        return res.status(404).json({ message: 'Maintenance not found' });
      }
      return success(res, data, 'Maintenance status updated successfully');
    } catch (e) {
      next(e);
    }
  },

  async remove(req, res, next) {
    try {
      await MaintenanceService.remove(Number(req.params.maintenance_id));
      return success(res, null, 'Maintenance deleted successfully', 204);
    } catch (e) {
      next(e);
    }
  },

  async getUpcoming(req, res, next) {
    try {
      const { page = 1, limit = 10, machine_id, type, priority } = req.query;
      const data = await MaintenanceService.getUpcoming({
        page: Number(page),
        limit: Number(limit),
        machine_id: machine_id !== undefined ? Number(machine_id) : undefined,
        type: type?.toString().trim() || undefined,
        priority: priority?.toString().trim() || undefined
      });
      return success(res, data);
    } catch (e) {
      next(e);
    }
  }
};