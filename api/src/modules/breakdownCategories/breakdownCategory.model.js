import { query } from '../../config/db.config.js';

export const BreakdownCategoryModel = {
  async create({ name, description }) {
    const result = await query(
      'INSERT INTO breakdown_categories (name, description) VALUES (?, ?)', 
      [name, description]
    );
    return { category_id: result.insertId, name, description };
  },

  async list() {
    return query(`
      SELECT category_id, name, description, created_at 
      FROM breakdown_categories 
      ORDER BY name
    `);
  },

  async getById(id) {
    const rows = await query(
      'SELECT category_id, name, description, created_at FROM breakdown_categories WHERE category_id = ?', 
      [id]
    );
    return rows[0];
  },

  async update(id, { name, description }) {
    await query(
      'UPDATE breakdown_categories SET name = ?, description = ? WHERE category_id = ?', 
      [name, description, id]
    );
    const rows = await query(
      'SELECT category_id, name, description, created_at FROM breakdown_categories WHERE category_id = ?', 
      [id]
    );
    return rows[0];
  },

  async remove(id) {
    await query('DELETE FROM breakdown_categories WHERE category_id = ?', [id]);
  },

  async getWithBreakdownCount() {
    return query(`
      SELECT 
        bc.category_id, 
        bc.name, 
        bc.description, 
        bc.created_at,
        COUNT(mb.breakdown_id) as breakdown_count
      FROM breakdown_categories bc
      LEFT JOIN machine_breakdowns mb ON bc.category_id = mb.category_id
      GROUP BY bc.category_id
      ORDER BY bc.name
    `);
  }
};