import { query } from '../../config/db.config.js';

export const DivisionTypeModel = {
  async create({ title }) {
    const result = await query('INSERT INTO division_types (title) VALUES (?)', [title]);
    return { division_type_id: result.insertId, title };
  },
  async list() {
    return query('SELECT * FROM division_types ORDER BY title');
  },
  async update(id, { title }) {
    await query('UPDATE division_types SET title = ? WHERE division_type_id = ?', [title, id]);
    const rows = await query('SELECT * FROM division_types WHERE division_type_id = ?', [id]);
    return rows[0];
  },
  async remove(id) {
    await query('DELETE FROM division_types WHERE division_type_id = ?', [id]);
  }
};
