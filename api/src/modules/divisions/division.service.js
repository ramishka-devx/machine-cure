import { DivisionModel } from './division.model.js';

export const DivisionService = {
  create: (payload) => DivisionModel.create(payload),
  list: () => DivisionModel.list(),
  update: (id, payload) => DivisionModel.update(id, payload),
  remove: (id) => DivisionModel.remove(id)
};
