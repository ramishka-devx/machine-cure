import { MeterModel } from './meter.model.js';

export const MeterService = {
  create: (payload) => MeterModel.create(payload),
  list: () => MeterModel.list(),
  update: (id, payload) => MeterModel.update(id, payload),
  remove: (id) => MeterModel.remove(id)
};
