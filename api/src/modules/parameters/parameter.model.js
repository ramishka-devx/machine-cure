import { query } from '../../config/db.config.js';

export const ParameterModel = {
  async create({ name, value_type, unit, meter_id }) {
    const result = await query('INSERT INTO parameters (name, value_type, unit, meter_id) VALUES (?, ?, ?, ?)', [name, value_type, unit, meter_id]);
    return { parameter_id: result.insertId, name, value_type, unit, meter_id };
  },
  async list() {
    return query('SELECT * FROM parameters ORDER BY parameter_id DESC');
  },
  async update(id, { name, value_type, unit, meter_id }) {
    await query('UPDATE parameters SET name = ?, value_type = ?, unit = ?, meter_id = ? WHERE parameter_id = ?', [name, value_type, unit, meter_id, id]);
    const rows = await query('SELECT * FROM parameters WHERE parameter_id = ?', [id]);
    return rows[0];
  },
  async remove(id) {
    await query('DELETE FROM parameters WHERE parameter_id = ?', [id]);
  }
};
