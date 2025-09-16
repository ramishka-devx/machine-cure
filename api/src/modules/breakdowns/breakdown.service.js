import { BreakdownModel } from './breakdown.model.js';

export const BreakdownService = {
  create: (payload, user_id) => {
    return BreakdownModel.create({ ...payload, reported_by: user_id });
  },
  
  list: (filters) => BreakdownModel.list(filters),
  
  getById: (id) => BreakdownModel.getById(id),
  
  update: (id, payload) => BreakdownModel.update(id, payload),
  
  updateStatus: (id, status_id, user_id) => BreakdownModel.updateStatus(id, status_id, user_id),
  
  assign: (id, assigned_to, user_id) => BreakdownModel.assign(id, assigned_to, user_id),
  
  startRepair: (id, user_id) => BreakdownModel.startRepair(id, user_id),
  
  completeRepair: (id, user_id, actual_data) => BreakdownModel.completeRepair(id, user_id, actual_data),
  
  remove: (id) => BreakdownModel.remove(id)
};