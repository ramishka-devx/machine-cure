import { BreakdownCategoryModel } from './breakdownCategory.model.js';

export const BreakdownCategoryService = {
  create: (payload) => BreakdownCategoryModel.create(payload),
  list: () => BreakdownCategoryModel.list(),
  getById: (id) => BreakdownCategoryModel.getById(id),
  update: (id, payload) => BreakdownCategoryModel.update(id, payload),
  remove: (id) => BreakdownCategoryModel.remove(id),
  getWithBreakdownCount: () => BreakdownCategoryModel.getWithBreakdownCount()
};