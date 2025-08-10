import { success } from '../../utils/apiResponse.js';
import { MachineService } from './machine.service.js';

export const MachineController = {
  async create(req, res, next) {
    try {
      const data = await MachineService.create(req.body);
      return success(res, data, 'Created', 201);
    } catch (e) {
      next(e);
    }
  },
  async list(req, res, next) {
    try {
      const { page = 1, limit = 10, division_id, q } = req.query;
      const data = await MachineService.list({
        page: Number(page),
        limit: Number(limit),
        division_id: division_id !== undefined ? Number(division_id) : undefined,
        q: q?.toString().trim() || undefined
      });
      return success(res, data);
    } catch (e) {
      next(e);
    }
  },
  async update(req, res, next) {
    try {
      const data = await MachineService.update(Number(req.params.machine_id), req.body);
      return success(res, data, 'Updated');
    } catch (e) {
      next(e);
    }
  },
  async remove(req, res, next) {
    try {
      await MachineService.remove(Number(req.params.machine_id));
      return success(res, null, 'Deleted', 204);
    } catch (e) {
      next(e);
    }
  }
};
