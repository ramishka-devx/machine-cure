import { query } from '../../config/db.config.js';

export const BreakdownStatusModel = {
  async create({ name, description, sort_order = 0 }) {
    const result = await query(
      'INSERT INTO breakdown_statuses (name, description, sort_order) VALUES (?, ?, ?)', 
      [name, description, sort_order]
    );
    return { status_id: result.insertId, name, description, sort_order };
  },

  async list() {
    return query(`
      SELECT status_id, name, description, sort_order, created_at 
      FROM breakdown_statuses 
      ORDER BY sort_order, name
    `);
  },

  async getById(id) {
    const rows = await query(
      'SELECT status_id, name, description, sort_order, created_at FROM breakdown_statuses WHERE status_id = ?', 
      [id]
    );
    return rows[0];
  },

  async update(id, { name, description, sort_order }) {
    await query(
      'UPDATE breakdown_statuses SET name = ?, description = ?, sort_order = ? WHERE status_id = ?', 
      [name, description, sort_order, id]
    );
    const rows = await query(
      'SELECT status_id, name, description, sort_order, created_at FROM breakdown_statuses WHERE status_id = ?', 
      [id]
    );
    return rows[0];
  },

  async remove(id) {
    await query('DELETE FROM breakdown_statuses WHERE status_id = ?', [id]);
  },

  async getWithBreakdownCount() {
    return query(`
      SELECT 
        bs.status_id, 
        bs.name, 
        bs.description, 
        bs.sort_order,
        bs.created_at,
        COUNT(mb.breakdown_id) as breakdown_count
      FROM breakdown_statuses bs
      LEFT JOIN machine_breakdowns mb ON bs.status_id = mb.status_id
      GROUP BY bs.status_id
      ORDER BY bs.sort_order, bs.name
    `);
  }
};