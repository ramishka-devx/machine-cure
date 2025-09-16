import { BreakdownStatusModel } from './breakdownStatus.model.js';

export const BreakdownStatusService = {
  create: (payload) => BreakdownStatusModel.create(payload),
  list: () => BreakdownStatusModel.list(),
  getById: (id) => BreakdownStatusModel.getById(id),
  update: (id, payload) => BreakdownStatusModel.update(id, payload),
  remove: (id) => BreakdownStatusModel.remove(id),
  getWithBreakdownCount: () => BreakdownStatusModel.getWithBreakdownCount()
};