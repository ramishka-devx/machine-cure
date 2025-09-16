import { BreakdownRepairModel } from './breakdownRepair.model.js';

export const BreakdownRepairService = {
  create: (breakdown_id, payload, user_id) => {
    return BreakdownRepairModel.create({ ...payload, breakdown_id, performed_by: user_id });
  },
  
  getByBreakdownId: (breakdown_id) => BreakdownRepairModel.getByBreakdownId(breakdown_id),
  
  getById: (id) => BreakdownRepairModel.getById(id),
  
  update: (id, payload) => BreakdownRepairModel.update(id, payload),
  
  start: (id, user_id) => BreakdownRepairModel.start(id, user_id),
  
  complete: (id, user_id, completion_data) => BreakdownRepairModel.complete(id, user_id, completion_data),
  
  remove: (id) => BreakdownRepairModel.remove(id)
};