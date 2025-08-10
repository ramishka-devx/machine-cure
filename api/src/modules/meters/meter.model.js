import { query } from '../../config/db.config.js';

export const MeterModel = {
  async create({ title, machine_id }) {
    const result = await query('INSERT INTO meters (title, machine_id) VALUES (?, ?)', [title, machine_id]);
    return { meter_id: result.insertId, title, machine_id };
  },
  async list() {
    return query('SELECT * FROM meters ORDER BY meter_id DESC');
  },
  async update(id, { title, machine_id }) {
    await query('UPDATE meters SET title = ?, machine_id = ? WHERE meter_id = ?', [title, machine_id, id]);
    const rows = await query('SELECT * FROM meters WHERE meter_id = ?', [id]);
    return rows[0];
  },
  async remove(id) {
    await query('DELETE FROM meters WHERE meter_id = ?', [id]);
  }
};
