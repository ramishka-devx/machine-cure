import { query } from '../../config/db.config.js';

export const KaizenModel = {
  async create(kaizenData) {
    const {
      title, description, problem_statement, proposed_solution, expected_benefits,
      implementation_plan, category_id, priority, submitted_by, machine_id, division_id,
      estimated_cost, estimated_savings, estimated_implementation_days
    } = kaizenData;

    // Get default status (Submitted)
    const [submittedStatus] = await query(
      'SELECT status_id FROM kaizen_statuses WHERE name = ? LIMIT 1',
      ['Submitted']
    );

    const sql = `
      INSERT INTO kaizens (
        title, description, problem_statement, proposed_solution, expected_benefits,
        implementation_plan, category_id, status_id, priority, submitted_by, machine_id,
        division_id, estimated_cost, estimated_savings, estimated_implementation_days,
        submitted_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())
    `;

    const result = await query(sql, [
      title, description, problem_statement, proposed_solution, expected_benefits,
      implementation_plan, category_id, 1 , priority, submitted_by,
      machine_id, division_id, estimated_cost, estimated_savings, estimated_implementation_days
    ]);

    return { kaizen_id: result.insertId, ...kaizenData, status_id: 1 };
  },

  async list({ page = 1, limit = 10, status_id, category_id, submitted_by, assigned_to, machine_id, division_id, priority, q } = {}) {
    const where = [];
    const params = [];

    if (status_id !== undefined) { where.push('k.status_id = ?'); params.push(status_id); }
    if (category_id !== undefined) { where.push('k.category_id = ?'); params.push(category_id); }
    if (submitted_by !== undefined) { where.push('k.submitted_by = ?'); params.push(submitted_by); }
    if (assigned_to !== undefined) { where.push('k.assigned_to = ?'); params.push(assigned_to); }
    if (machine_id !== undefined) { where.push('k.machine_id = ?'); params.push(machine_id); }
    if (division_id !== undefined) { where.push('k.division_id = ?'); params.push(division_id); }
    if (priority !== undefined) { where.push('k.priority = ?'); params.push(priority); }
    if (q) {
      where.push('(k.title LIKE ? OR k.description LIKE ?)');
      params.push(`%${q}%`, `%${q}%`);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const offset = (Number(page) - 1) * Number(limit);

    const sql = `
      SELECT 
        k.kaizen_id, k.title, k.description, k.problem_statement, k.proposed_solution,
        k.expected_benefits, k.implementation_plan, k.priority, k.estimated_cost,
        k.estimated_savings, k.estimated_implementation_days, k.actual_cost,
        k.actual_savings, k.actual_implementation_days, k.submitted_at, k.assigned_at,
        k.started_at, k.completed_at, k.reviewed_at, k.created_at, k.updated_at,
        kc.name as category, ks.name as status,
        u1.first_name as submitted_by_first_name, u1.last_name as submitted_by_last_name,
        u2.first_name as assigned_to_first_name, u2.last_name as assigned_to_last_name,
        m.title as machine_title, d.title as division_title
      FROM kaizens k
      LEFT JOIN kaizen_categories kc ON k.category_id = kc.category_id
      LEFT JOIN kaizen_statuses ks ON k.status_id = ks.status_id
      LEFT JOIN users u1 ON k.submitted_by = u1.user_id
      LEFT JOIN users u2 ON k.assigned_to = u2.user_id
      LEFT JOIN machines m ON k.machine_id = m.machine_id
      LEFT JOIN divisions d ON k.division_id = d.division_id
      ${whereSql}
      ORDER BY k.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const rows = await query(sql, [...params, Number(limit), Number(offset)]);

    const countSql = `SELECT COUNT(*) as count FROM kaizens k ${whereSql}`;
    const [{ count }] = await query(countSql, params);

    return { rows, total: count, page: Number(page), limit: Number(limit) };
  },

  async findById(kaizen_id) {
    const sql = `
      SELECT 
        k.*, kc.name as category, ks.name as status,
        u1.first_name as submitted_by_first_name, u1.last_name as submitted_by_last_name,
        u2.first_name as assigned_to_first_name, u2.last_name as assigned_to_last_name,
        m.title as machine_title, d.title as division_title
      FROM kaizens k
      LEFT JOIN kaizen_categories kc ON k.category_id = kc.category_id
      LEFT JOIN kaizen_statuses ks ON k.status_id = ks.status_id
      LEFT JOIN users u1 ON k.submitted_by = u1.user_id
      LEFT JOIN users u2 ON k.assigned_to = u2.user_id
      LEFT JOIN machines m ON k.machine_id = m.machine_id
      LEFT JOIN divisions d ON k.division_id = d.division_id
      WHERE k.kaizen_id = ?
      LIMIT 1
    `;
    const rows = await query(sql, [kaizen_id]);
    return rows[0];
  },

  async update(kaizen_id, updateData) {
    const fields = [];
    const params = [];

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(updateData[key]);
      }
    });

    if (fields.length === 0) return null;

    fields.push('updated_at = NOW()');
    params.push(kaizen_id);

    const sql = `UPDATE kaizens SET ${fields.join(', ')} WHERE kaizen_id = ?`;
    await query(sql, params);

    return this.findById(kaizen_id);
  },

  async updateStatus(kaizen_id, status_id, user_id, notes = null) {
    // Get current status for history
    const current = await this.findById(kaizen_id);
    if (!current) return null;

    // Update status
    const updateFields = ['status_id = ?', 'updated_at = NOW()'];
    const updateParams = [status_id];

    // Set timestamps based on status
    const [status] = await query('SELECT name FROM kaizen_statuses WHERE status_id = ?', [status_id]);
    if (status) {
      switch (status.name.toLowerCase()) {
        case 'in progress':
          updateFields.push('started_at = NOW()');
          break;
        case 'completed':
          updateFields.push('completed_at = NOW()');
          break;
        case 'under review':
          updateFields.push('reviewed_at = NOW()');
          break;
      }
    }

    updateParams.push(kaizen_id);
    await query(`UPDATE kaizens SET ${updateFields.join(', ')} WHERE kaizen_id = ?`, updateParams);

    // Add to history
    await query(
      'INSERT INTO kaizen_history (kaizen_id, user_id, action, old_status_id, new_status_id, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [kaizen_id, user_id, 'status_change', current.status_id, status_id, notes]
    );

    return this.findById(kaizen_id);
  },

  async assign(kaizen_id, assigned_to, assigned_by, notes = null) {
    await query(
      'UPDATE kaizens SET assigned_to = ?, assigned_at = NOW(), updated_at = NOW() WHERE kaizen_id = ?',
      [assigned_to, kaizen_id]
    );

    // Add to history
    await query(
      'INSERT INTO kaizen_history (kaizen_id, user_id, action, notes, created_at) VALUES (?, ?, ?, ?, NOW())',
      [kaizen_id, assigned_by, `assigned_to_user_${assigned_to}`, notes]
    );

    return this.findById(kaizen_id);
  },

  async remove(kaizen_id) {
    await query('DELETE FROM kaizens WHERE kaizen_id = ?', [kaizen_id]);
  },

  async getCategories() {
    return await query('SELECT * FROM kaizen_categories ORDER BY name');
  },

  async getStatuses() {
    return await query('SELECT * FROM kaizen_statuses ORDER BY sort_order');
  },

  async getComments(kaizen_id) {
    const sql = `
      SELECT 
        kc.comment_id, kc.comment, kc.is_internal, kc.created_at,
        u.first_name, u.last_name
      FROM kaizen_comments kc
      LEFT JOIN users u ON kc.user_id = u.user_id
      WHERE kc.kaizen_id = ?
      ORDER BY kc.created_at ASC
    `;
    return await query(sql, [kaizen_id]);
  },

  async addComment(kaizen_id, user_id, comment, is_internal = false) {
    const result = await query(
      'INSERT INTO kaizen_comments (kaizen_id, user_id, comment, is_internal, created_at) VALUES (?, ?, ?, ?, NOW())',
      [kaizen_id, user_id, comment, is_internal]
    );
    
    // Add to history
    await query(
      'INSERT INTO kaizen_history (kaizen_id, user_id, action, notes, created_at) VALUES (?, ?, ?, ?, NOW())',
      [kaizen_id, user_id, 'comment_added', comment.substring(0, 100)]
    );

    return { comment_id: result.insertId, kaizen_id, user_id, comment, is_internal };
  },

  async getHistory(kaizen_id) {
    const sql = `
      SELECT 
        kh.history_id, kh.action, kh.notes, kh.created_at,
        u.first_name, u.last_name,
        os.name as old_status, ns.name as new_status
      FROM kaizen_history kh
      LEFT JOIN users u ON kh.user_id = u.user_id
      LEFT JOIN kaizen_statuses os ON kh.old_status_id = os.status_id
      LEFT JOIN kaizen_statuses ns ON kh.new_status_id = ns.status_id
      WHERE kh.kaizen_id = ?
      ORDER BY kh.created_at DESC
    `;
    return await query(sql, [kaizen_id]);
  },

  async getStats() {
    const stats = {};
    
    // Total kaizens by status
    stats.byStatus = await query(`
      SELECT ks.name, COUNT(k.kaizen_id) as count
      FROM kaizen_statuses ks
      LEFT JOIN kaizens k ON ks.status_id = k.status_id
      GROUP BY ks.status_id, ks.name
      ORDER BY ks.sort_order
    `);

    // Also get actual counts for debugging
    const actualCounts = await query(`
      SELECT ks.name, COUNT(k.kaizen_id) as actual_count
      FROM kaizens k
      RIGHT JOIN kaizen_statuses ks ON k.status_id = ks.status_id
      GROUP BY ks.status_id, ks.name
      ORDER BY ks.sort_order
    `);

    // Get total count of kaizens
    const [totalCount] = await query('SELECT COUNT(*) as total FROM kaizens');
    stats.totalKaizens = totalCount.total;

    // Total savings
    const [savings] = await query(`
      SELECT 
        SUM(estimated_savings) as estimated_total,
        SUM(actual_savings) as actual_total
      FROM kaizens
    `);
    stats.savings = savings;

    // Top categories
    stats.topCategories = await query(`
      SELECT kc.name, COUNT(k.kaizen_id) as count
      FROM kaizen_categories kc
      LEFT JOIN kaizens k ON kc.category_id = k.category_id
      GROUP BY kc.category_id, kc.name
      ORDER BY count DESC
      LIMIT 5
    `);

    return stats;
  }
};