import { success } from '../../utils/apiResponse.js';
import { DivisionTypeService } from './divisionType.service.js';

export const DivisionTypeController = {
  async create(req, res, next) { try { const data = await DivisionTypeService.create(req.body); return success(res, data, 'Created', 201);} catch (e) { next(e);} },
  async list(req, res, next) { try { const data = await DivisionTypeService.list(); return success(res, data);} catch (e) { next(e);} },
  async update(req, res, next) { try { const data = await DivisionTypeService.update(Number(req.params.division_type_id), req.body); return success(res, data, 'Updated');} catch (e) { next(e);} },
  async remove(req, res, next) { try { await DivisionTypeService.remove(Number(req.params.division_type_id)); return success(res, null, 'Deleted', 204);} catch (e) { next(e);} }
};
