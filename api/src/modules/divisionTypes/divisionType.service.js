import { DivisionTypeModel } from './divisionType.model.js';

export const DivisionTypeService = {
  create: (payload) => DivisionTypeModel.create(payload),
  list: () => DivisionTypeModel.list(),
  update: (id, payload) => DivisionTypeModel.update(id, payload),
  remove: (id) => DivisionTypeModel.remove(id)
};
