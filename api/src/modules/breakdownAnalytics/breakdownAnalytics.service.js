import { BreakdownAnalyticsModel } from './breakdownAnalytics.model.js';

export const BreakdownAnalyticsService = {
  getSummary: (date_from, date_to) => BreakdownAnalyticsModel.getSummary(date_from, date_to),
  getByMachine: (date_from, date_to) => BreakdownAnalyticsModel.getByMachine(date_from, date_to),
  getByCategory: (date_from, date_to) => BreakdownAnalyticsModel.getByCategory(date_from, date_to),
  getByDivision: (date_from, date_to) => BreakdownAnalyticsModel.getByDivision(date_from, date_to),
  getTrends: (period, date_from, date_to) => BreakdownAnalyticsModel.getTrends(period, date_from, date_to),
  getMTBF: (machine_id) => BreakdownAnalyticsModel.getMTBF(machine_id),
  getMTTR: (machine_id) => BreakdownAnalyticsModel.getMTTR(machine_id),
  getProblematicMachines: (limit) => BreakdownAnalyticsModel.getProblematicMachines(limit)
};