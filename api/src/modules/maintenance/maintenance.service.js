import { MaintenanceModel } from './maintenance.model.js';

export const MaintenanceService = {
  create: (payload, user_id) => MaintenanceModel.create(payload, user_id),
  list: (filters) => MaintenanceModel.list(filters),
  update: (id, payload) => MaintenanceModel.update(id, payload),
  updateStatus: (id, status) => MaintenanceModel.updateStatus(id, status),
  remove: (id) => MaintenanceModel.remove(id)
};