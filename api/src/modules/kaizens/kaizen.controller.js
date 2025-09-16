import { success } from '../../utils/apiResponse.js';
import { KaizenService } from './kaizen.service.js';

export const KaizenController = {
  async create(req, res, next) {
    try {
      const kaizenData = {
        ...req.body,
        submitted_by: req.user.user_id // From auth middleware
      };
      const data = await KaizenService.create(kaizenData);
      return success(res, data, 'Kaizen created successfully', 201);
    } catch (e) {
      next(e);
    }
  },

  async list(req, res, next) {
    try {
      const { page = 1, limit = 10, status_id, category_id, submitted_by, assigned_to, machine_id, division_id, priority, q } = req.query;
      const data = await KaizenService.list({
        page: Number(page),
        limit: Number(limit),
        status_id: status_id !== undefined ? Number(status_id) : undefined,
        category_id: category_id !== undefined ? Number(category_id) : undefined,
        submitted_by: submitted_by !== undefined ? Number(submitted_by) : undefined,
        assigned_to: assigned_to !== undefined ? Number(assigned_to) : undefined,
        machine_id: machine_id !== undefined ? Number(machine_id) : undefined,
        division_id: division_id !== undefined ? Number(division_id) : undefined,
        priority: priority?.toString().trim() || undefined,
        q: q?.toString().trim() || undefined
      });
      return success(res, data);
    } catch (e) {
      next(e);
    }
  },

  async findById(req, res, next) {
    try {
      const data = await KaizenService.findById(Number(req.params.kaizen_id));
      return success(res, data);
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const data = await KaizenService.update(Number(req.params.kaizen_id), req.body);
      return success(res, data, 'Kaizen updated successfully');
    } catch (e) {
      next(e);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const { status_id, notes } = req.body;
      const data = await KaizenService.updateStatus(
        Number(req.params.kaizen_id),
        status_id,
        req.user.user_id,
        notes
      );
      return success(res, data, 'Kaizen status updated successfully');
    } catch (e) {
      next(e);
    }
  },

  async assign(req, res, next) {
    try {
      const { assigned_to, notes } = req.body;
      const data = await KaizenService.assign(
        Number(req.params.kaizen_id),
        assigned_to,
        req.user.user_id,
        notes
      );
      return success(res, data, 'Kaizen assigned successfully');
    } catch (e) {
      next(e);
    }
  },

  async remove(req, res, next) {
    try {
      const data = await KaizenService.remove(Number(req.params.kaizen_id));
      return success(res, data);
    } catch (e) {
      next(e);
    }
  },

  async getCategories(req, res, next) {
    try {
      const data = await KaizenService.getCategories();
      return success(res, data);
    } catch (e) {
      next(e);
    }
  },

  async getStatuses(req, res, next) {
    try {
      const data = await KaizenService.getStatuses();
      return success(res, data);
    } catch (e) {
      next(e);
    }
  },

  async getComments(req, res, next) {
    try {
      const data = await KaizenService.getComments(Number(req.params.kaizen_id));
      return success(res, data);
    } catch (e) {
      next(e);
    }
  },

  async addComment(req, res, next) {
    try {
      const { comment, is_internal } = req.body;
      const data = await KaizenService.addComment(
        Number(req.params.kaizen_id),
        req.user.user_id,
        comment,
        is_internal
      );
      return success(res, data, 'Comment added successfully', 201);
    } catch (e) {
      next(e);
    }
  },

  async getHistory(req, res, next) {
    try {
      const data = await KaizenService.getHistory(Number(req.params.kaizen_id));
      return success(res, data);
    } catch (e) {
      next(e);
    }
  },

  async getStats(req, res, next) {
    try {
      const data = await KaizenService.getStats();
      return success(res, data);
    } catch (e) {
      next(e);
    }
  }
};