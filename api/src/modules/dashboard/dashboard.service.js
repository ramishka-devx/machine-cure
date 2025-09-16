import { DashboardModel } from './dashboard.model.js';

export const DashboardService = {
  getMetrics: () => DashboardModel.getMetrics(),
  getCriticalIssues: () => DashboardModel.getCriticalIssues(),
  getRecentActivity: () => DashboardModel.getRecentActivity()
};