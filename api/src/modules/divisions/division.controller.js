import { success } from '../../utils/apiResponse.js';
import { DivisionService } from './division.service.js';

export const DivisionController = {
  async create(req, res, next) {
    try {
      const data = await DivisionService.create(req.body);
      return success(res, data, 'Created', 201);
    } catch (e) {
      next(e);
    }
  },
  async list(req, res, next) {
    try {
      const data = await DivisionService.list();
      return success(res, data);
    } catch (e) {
      next(e);
    }
  },
  async update(req, res, next) {
    try {
      const data = await DivisionService.update(Number(req.params.division_id), req.body);
      return success(res, data, 'Updated');
    } catch (e) {
      next(e);
    }
  },
  async remove(req, res, next) {
    try {
      await DivisionService.remove(Number(req.params.division_id));
      return success(res, null, 'Deleted', 204);
    } catch (e) {
      next(e);
    }
  }
};
