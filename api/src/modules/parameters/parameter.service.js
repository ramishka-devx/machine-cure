import { ParameterModel } from './parameter.model.js';

export const ParameterService = {
  create: (payload) => ParameterModel.create(payload),
  list: () => ParameterModel.list(),
  update: (id, payload) => ParameterModel.update(id, payload),
  remove: (id) => ParameterModel.remove(id)
};
