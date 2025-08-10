import { query } from '../../config/db.config.js';

export const MachineModel = {
  async create({ title, division_id }) {
    const result = await query('INSERT INTO machines (title, division_id) VALUES (?, ?)', [title, division_id]);
    return { machine_id: result.insertId, title, division_id };
  },
  async list({ page = 1, limit = 10, division_id, q } = {}) {
    const where = [];
    const params = [];
    if (division_id !== undefined) { where.push('division_id = ?'); params.push(division_id); }
    if (q) { where.push('title LIKE ?'); params.push(`%${q}%`); }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const offset = (Number(page) - 1) * Number(limit);
    const rows = await query(
      `SELECT * FROM machines ${whereSql} ORDER BY machine_id DESC LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)]
    );
    const [{ count }] = await query(
      `SELECT COUNT(*) as count FROM machines ${whereSql}`,
      params
    );
    return { rows, total: count, page: Number(page), limit: Number(limit) };
  },
  async update(id, { title, division_id }) {
    await query('UPDATE machines SET title = ?, division_id = ? WHERE machine_id = ?', [title, division_id, id]);
    const rows = await query('SELECT * FROM machines WHERE machine_id = ?', [id]);
    return rows[0];
  },
  async remove(id) {
    await query('DELETE FROM machines WHERE machine_id = ?', [id]);
  }
};
