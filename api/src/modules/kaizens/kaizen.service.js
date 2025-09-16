import { KaizenModel } from './kaizen.model.js';
import { badRequest, notFound } from '../../utils/errorHandler.js';

export const KaizenService = {
  async create(kaizenData) {
    // Validate category exists
    const categories = await KaizenModel.getCategories();
    const categoryExists = categories.find(c => c.category_id === kaizenData.category_id);
    if (!categoryExists) {
      throw badRequest('Invalid category_id');
    }

    return await KaizenModel.create(kaizenData);
  },

  async list(options) {
    return await KaizenModel.list(options);
  },

  async findById(kaizen_id) {
    const kaizen = await KaizenModel.findById(kaizen_id);
    if (!kaizen) {
      throw notFound('Kaizen not found');
    }
    return kaizen;
  },

  async update(kaizen_id, updateData) {
    const kaizen = await KaizenModel.findById(kaizen_id);
    if (!kaizen) {
      throw notFound('Kaizen not found');
    }

    // Validate category if provided
    if (updateData.category_id) {
      const categories = await KaizenModel.getCategories();
      const categoryExists = categories.find(c => c.category_id === updateData.category_id);
      if (!categoryExists) {
        throw badRequest('Invalid category_id');
      }
    }

    return await KaizenModel.update(kaizen_id, updateData);
  },

  async updateStatus(kaizen_id, status_id, user_id, notes) {
    const kaizen = await KaizenModel.findById(kaizen_id);
    if (!kaizen) {
      throw notFound('Kaizen not found');
    }

    // Validate status exists
    const statuses = await KaizenModel.getStatuses();
    const statusExists = statuses.find(s => s.status_id === status_id);
    if (!statusExists) {
      throw badRequest('Invalid status_id');
    }

    return await KaizenModel.updateStatus(kaizen_id, status_id, user_id, notes);
  },

  async assign(kaizen_id, assigned_to, assigned_by, notes) {
    const kaizen = await KaizenModel.findById(kaizen_id);
    if (!kaizen) {
      throw notFound('Kaizen not found');
    }

    return await KaizenModel.assign(kaizen_id, assigned_to, assigned_by, notes);
  },

  async remove(kaizen_id) {
    const kaizen = await KaizenModel.findById(kaizen_id);
    if (!kaizen) {
      throw notFound('Kaizen not found');
    }
    
    await KaizenModel.remove(kaizen_id);
    return { message: 'Kaizen deleted successfully' };
  },

  async getCategories() {
    return await KaizenModel.getCategories();
  },

  async getStatuses() {
    return await KaizenModel.getStatuses();
  },

  async getComments(kaizen_id) {
    const kaizen = await KaizenModel.findById(kaizen_id);
    if (!kaizen) {
      throw notFound('Kaizen not found');
    }
    
    return await KaizenModel.getComments(kaizen_id);
  },

  async addComment(kaizen_id, user_id, comment, is_internal) {
    const kaizen = await KaizenModel.findById(kaizen_id);
    if (!kaizen) {
      throw notFound('Kaizen not found');
    }
    
    return await KaizenModel.addComment(kaizen_id, user_id, comment, is_internal);
  },

  async getHistory(kaizen_id) {
    const kaizen = await KaizenModel.findById(kaizen_id);
    if (!kaizen) {
      throw notFound('Kaizen not found');
    }
    
    return await KaizenModel.getHistory(kaizen_id);
  },

  async getStats() {
    return await KaizenModel.getStats();
  }
};