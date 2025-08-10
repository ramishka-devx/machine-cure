import { success } from '../../utils/apiResponse.js';
import { ParameterService } from './parameter.service.js';

export const ParameterController = {
  async create(req, res, next) { try { const data = await ParameterService.create(req.body); return success(res, data, 'Created', 201);} catch (e) { next(e);} },
  async list(req, res, next) { try { const data = await ParameterService.list(); return success(res, data);} catch (e) { next(e);} },
  async update(req, res, next) { try { const data = await ParameterService.update(Number(req.params.parameter_id), req.body); return success(res, data, 'Updated');} catch (e) { next(e);} },
  async remove(req, res, next) { try { await ParameterService.remove(Number(req.params.parameter_id)); return success(res, null, 'Deleted', 204);} catch (e) { next(e);} }
};
