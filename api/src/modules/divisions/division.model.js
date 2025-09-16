import { query } from '../../config/db.config.js';

export const DivisionModel = {
  async create({ title, parent_id = null, division_type_id }) {
    const result = await query('INSERT INTO divisions (title, parent_id, division_type_id) VALUES (?, ?, ?)', [title, parent_id, division_type_id]);
    return { division_id: result.insertId, title, parent_id, division_type_id };
  },
  async list() {
    return query('SELECT d.division_id, d.title, d.parent_id, dt.title as divition_type, dt.division_type_id FROM divisions d JOIN division_types dt ON dt.division_type_id = d.division_type_id ORDER BY d.division_id DESC');
  },
  async update(id, { title, parent_id = null, division_type_id }) {
    await query('UPDATE divisions SET title = ?, parent_id = ?, division_type_id = ? WHERE division_id = ?', [title, parent_id, division_type_id, id]);
    const rows = await query('SELECT * FROM divisions WHERE division_id = ?', [id]);
    return rows[0];
  },
  async remove(id) {
    await query('DELETE FROM divisions WHERE division_id = ?', [id]);
  }
};
