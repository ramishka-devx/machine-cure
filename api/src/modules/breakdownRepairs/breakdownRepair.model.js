import { query } from '../../config/db.config.js';

export const BreakdownRepairModel = {
  async create(repairData) {
    const {
      breakdown_id, repair_title, repair_description, repair_type,
      parts_used, labor_hours, parts_cost, labor_cost, performed_by
    } = repairData;

    const sql = `
      INSERT INTO breakdown_repairs (
        breakdown_id, repair_title, repair_description, repair_type,
        parts_used, labor_hours, parts_cost, labor_cost, performed_by,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const result = await query(sql, [
      breakdown_id, repair_title, repair_description, repair_type,
      parts_used, labor_hours, parts_cost, labor_cost, performed_by
    ]);

    return { repair_id: result.insertId, ...repairData };
  },

  async getByBreakdownId(breakdown_id) {
    const sql = `
      SELECT 
        br.repair_id, br.repair_title, br.repair_description, br.repair_type,
        br.parts_used, br.labor_hours, br.parts_cost, br.labor_cost,
        br.started_at, br.completed_at, br.notes, br.created_at, br.updated_at,
        u.user_id as performed_by_id, u.first_name as performed_by_first_name, 
        u.last_name as performed_by_last_name, u.email as performed_by_email
      FROM breakdown_repairs br
      JOIN users u ON br.performed_by = u.user_id
      WHERE br.breakdown_id = ?
      ORDER BY br.created_at ASC
    `;

    const repairs = await query(sql, [breakdown_id]);
    
    return repairs.map(row => ({
      repair_id: row.repair_id,
      repair_title: row.repair_title,
      repair_description: row.repair_description,
      repair_type: row.repair_type,
      parts_used: row.parts_used,
      labor_hours: row.labor_hours,
      parts_cost: row.parts_cost,
      labor_cost: row.labor_cost,
      started_at: row.started_at,
      completed_at: row.completed_at,
      notes: row.notes,
      created_at: row.created_at,
      updated_at: row.updated_at,
      performed_by: {
        user_id: row.performed_by_id,
        first_name: row.performed_by_first_name,
        last_name: row.performed_by_last_name,
        email: row.performed_by_email
      }
    }));
  },

  async getById(id) {
    const sql = `
      SELECT 
        br.*, 
        u.first_name as performed_by_first_name, 
        u.last_name as performed_by_last_name, 
        u.email as performed_by_email,
        mb.title as breakdown_title
      FROM breakdown_repairs br
      JOIN users u ON br.performed_by = u.user_id
      JOIN machine_breakdowns mb ON br.breakdown_id = mb.breakdown_id
      WHERE br.repair_id = ?
    `;

    const rows = await query(sql, [id]);
    if (rows.length === 0) return null;

    const row = rows[0];
    return {
      repair_id: row.repair_id,
      breakdown_id: row.breakdown_id,
      breakdown_title: row.breakdown_title,
      repair_title: row.repair_title,
      repair_description: row.repair_description,
      repair_type: row.repair_type,
      parts_used: row.parts_used,
      labor_hours: row.labor_hours,
      parts_cost: row.parts_cost,
      labor_cost: row.labor_cost,
      started_at: row.started_at,
      completed_at: row.completed_at,
      notes: row.notes,
      created_at: row.created_at,
      updated_at: row.updated_at,
      performed_by: {
        user_id: row.performed_by,
        first_name: row.performed_by_first_name,
        last_name: row.performed_by_last_name,
        email: row.performed_by_email
      }
    };
  },

  async update(id, updateData) {
    const {
      repair_title, repair_description, repair_type, parts_used,
      labor_hours, parts_cost, labor_cost, notes
    } = updateData;

    const sql = `
      UPDATE breakdown_repairs 
      SET repair_title = ?, repair_description = ?, repair_type = ?, parts_used = ?,
          labor_hours = ?, parts_cost = ?, labor_cost = ?, notes = ?, updated_at = NOW()
      WHERE repair_id = ?
    `;

    await query(sql, [
      repair_title, repair_description, repair_type, parts_used,
      labor_hours, parts_cost, labor_cost, notes, id
    ]);

    return this.getById(id);
  },

  async start(id, user_id) {
    const sql = `
      UPDATE breakdown_repairs 
      SET started_at = NOW(), updated_at = NOW()
      WHERE repair_id = ?
    `;

    await query(sql, [id]);
    return this.getById(id);
  },

  async complete(id, user_id, completion_data = {}) {
    const { notes, final_labor_hours, final_parts_cost, final_labor_cost } = completion_data;

    let sql = `UPDATE breakdown_repairs SET completed_at = NOW(), updated_at = NOW()`;
    let params = [];

    if (notes) {
      sql += `, notes = ?`;
      params.push(notes);
    }

    if (final_labor_hours !== undefined) {
      sql += `, labor_hours = ?`;
      params.push(final_labor_hours);
    }

    if (final_parts_cost !== undefined) {
      sql += `, parts_cost = ?`;
      params.push(final_parts_cost);
    }

    if (final_labor_cost !== undefined) {
      sql += `, labor_cost = ?`;
      params.push(final_labor_cost);
    }

    sql += ` WHERE repair_id = ?`;
    params.push(id);

    await query(sql, params);
    return this.getById(id);
  },

  async remove(id) {
    await query('DELETE FROM breakdown_repairs WHERE repair_id = ?', [id]);
  }
};