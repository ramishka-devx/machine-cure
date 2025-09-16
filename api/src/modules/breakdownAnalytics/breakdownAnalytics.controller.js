import { success } from '../../utils/apiResponse.js';
import { BreakdownAnalyticsService } from './breakdownAnalytics.service.js';

export const BreakdownAnalyticsController = {
  async getSummary(req, res, next) {
    try {
      const { date_from, date_to } = req.query;
      const data = await BreakdownAnalyticsService.getSummary(date_from, date_to);
      return success(res, data);
    } catch (e) {
      next(e);
    }
  },

  async getByMachine(req, res, next) {
    try {
      const { date_from, date_to } = req.query;
      const data = await BreakdownAnalyticsService.getByMachine(date_from, date_to);
      return success(res, data);
    } catch (e) {
      next(e);
    }
  },

  async getByCategory(req, res, next) {
    try {
      const { date_from, date_to } = req.query;
      const data = await BreakdownAnalyticsService.getByCategory(date_from, date_to);
      return success(res, data);
    } catch (e) {
      next(e);
    }
  },

  async getByDivision(req, res, next) {
    try {
      const { date_from, date_to } = req.query;
      const data = await BreakdownAnalyticsService.getByDivision(date_from, date_to);
      return success(res, data);
    } catch (e) {
      next(e);
    }
  },

  async getTrends(req, res, next) {
    try {
      const { period = 'month', date_from, date_to } = req.query;
      const data = await BreakdownAnalyticsService.getTrends(period, date_from, date_to);
      return success(res, data);
    } catch (e) {
      next(e);
    }
  },

  async getMTBF(req, res, next) {
    try {
      const { machine_id } = req.query;
      const data = await BreakdownAnalyticsService.getMTBF(machine_id ? Number(machine_id) : null);
      return success(res, data);
    } catch (e) {
      next(e);
    }
  },

  async getMTTR(req, res, next) {
    try {
      const { machine_id } = req.query;
      const data = await BreakdownAnalyticsService.getMTTR(machine_id ? Number(machine_id) : null);
      return success(res, data);
    } catch (e) {
      next(e);
    }
  },

  async getProblematicMachines(req, res, next) {
    try {
      const { limit = 10 } = req.query;
      const data = await BreakdownAnalyticsService.getProblematicMachines(Number(limit));
      return success(res, data);
    } catch (e) {
      next(e);
    }
  }
};