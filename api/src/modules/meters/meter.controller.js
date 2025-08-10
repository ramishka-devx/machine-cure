import { success } from '../../utils/apiResponse.js';
import { MeterService } from './meter.service.js';

export const MeterController = {
  async create(req, res, next) { try { const data = await MeterService.create(req.body); return success(res, data, 'Created', 201);} catch (e) { next(e);} },
  async list(req, res, next) { try { const data = await MeterService.list(); return success(res, data);} catch (e) { next(e);} },
  async update(req, res, next) { try { const data = await MeterService.update(Number(req.params.meter_id), req.body); return success(res, data, 'Updated');} catch (e) { next(e);} },
  async remove(req, res, next) { try { await MeterService.remove(Number(req.params.meter_id)); return success(res, null, 'Deleted', 204);} catch (e) { next(e);} }
};
