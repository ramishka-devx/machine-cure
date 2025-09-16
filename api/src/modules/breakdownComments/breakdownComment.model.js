import { query } from '../../config/db.config.js';

export const BreakdownCommentModel = {
  async create({ breakdown_id, user_id, comment, is_internal = false }) {
    const sql = `
      INSERT INTO breakdown_comments (breakdown_id, user_id, comment, is_internal, created_at)
      VALUES (?, ?, ?, ?, NOW())
    `;

    const result = await query(sql, [breakdown_id, user_id, comment, is_internal]);
    return { comment_id: result.insertId, breakdown_id, user_id, comment, is_internal };
  },

  async getByBreakdownId(breakdown_id, include_internal = true) {
    let whereClause = 'WHERE bc.breakdown_id = ?';
    const params = [breakdown_id];

    if (!include_internal) {
      whereClause += ' AND bc.is_internal = FALSE';
    }

    const sql = `
      SELECT 
        bc.comment_id, bc.comment, bc.is_internal, bc.created_at,
        u.user_id, u.first_name, u.last_name, u.email
      FROM breakdown_comments bc
      JOIN users u ON bc.user_id = u.user_id
      ${whereClause}
      ORDER BY bc.created_at ASC
    `;

    const comments = await query(sql, params);
    
    return comments.map(row => ({
      comment_id: row.comment_id,
      comment: row.comment,
      is_internal: row.is_internal,
      created_at: row.created_at,
      user: {
        user_id: row.user_id,
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email
      }
    }));
  },

  async getById(id) {
    const sql = `
      SELECT 
        bc.*, 
        u.first_name, u.last_name, u.email,
        mb.title as breakdown_title
      FROM breakdown_comments bc
      JOIN users u ON bc.user_id = u.user_id
      JOIN machine_breakdowns mb ON bc.breakdown_id = mb.breakdown_id
      WHERE bc.comment_id = ?
    `;

    const rows = await query(sql, [id]);
    if (rows.length === 0) return null;

    const row = rows[0];
    return {
      comment_id: row.comment_id,
      breakdown_id: row.breakdown_id,
      breakdown_title: row.breakdown_title,
      comment: row.comment,
      is_internal: row.is_internal,
      created_at: row.created_at,
      user: {
        user_id: row.user_id,
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email
      }
    };
  },

  async update(id, { comment, is_internal }) {
    const sql = `
      UPDATE breakdown_comments 
      SET comment = ?, is_internal = ?
      WHERE comment_id = ?
    `;

    await query(sql, [comment, is_internal, id]);
    return this.getById(id);
  },

  async remove(id) {
    await query('DELETE FROM breakdown_comments WHERE comment_id = ?', [id]);
  }
};