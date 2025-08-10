import { MachineModel } from './machine.model.js';

export const MachineService = {
  create: (payload) => MachineModel.create(payload),
  list: (filters) => MachineModel.list(filters),
  update: (id, payload) => MachineModel.update(id, payload),
  remove: (id) => MachineModel.remove(id)
};
