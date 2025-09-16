import { BreakdownCommentModel } from './breakdownComment.model.js';

export const BreakdownCommentService = {
  create: (breakdown_id, payload, user_id) => {
    return BreakdownCommentModel.create({ ...payload, breakdown_id, user_id });
  },
  
  getByBreakdownId: (breakdown_id, include_internal) => BreakdownCommentModel.getByBreakdownId(breakdown_id, include_internal),
  
  getById: (id) => BreakdownCommentModel.getById(id),
  
  update: (id, payload) => BreakdownCommentModel.update(id, payload),
  
  remove: (id) => BreakdownCommentModel.remove(id)
};