import { success } from '../../utils/apiResponse.js';
import { DashboardService } from './dashboard.service.js';

export const DashboardController = {
  async getMetrics(req, res, next) {
    try {
      const data = await DashboardService.getMetrics();
      return success(res, data);
    } catch (e) {
      next(e);
    }
  },

  async getCriticalIssues(req, res, next) {
    try {
      const data = await DashboardService.getCriticalIssues();
      return success(res, data);
    } catch (e) {
      next(e);
    }
  },

  async getRecentActivity(req, res, next) {
    try {
      const data = await DashboardService.getRecentActivity();
      return success(res, data);
    } catch (e) {
      next(e);
    }
  }
};