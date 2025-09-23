import { query } from '../../config/db.config.js';

export const MaintenanceModel = {
  async create({ machine_id, title, description, type, priority, estimated_duration_hours, estimated_cost, scheduled_date, due_date }, scheduled_by) {
    const result = await query(
      `INSERT INTO machine_maintenance (
        machine_id, title, description, type, status, priority, scheduled_by,
        estimated_duration_hours, estimated_cost, scheduled_date, due_date,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, 'scheduled', ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [machine_id, title, description, type, priority, scheduled_by, estimated_duration_hours, estimated_cost, scheduled_date, due_date]
    );
    
    return { 
      maintenance_id: result.insertId, 
      machine_id, 
      title, 
      description, 
      type, 
      status: 'scheduled',
      priority, 
      scheduled_by,
      estimated_duration_hours, 
      estimated_cost, 
      scheduled_date, 
      due_date 
    };
  },

  async list({ page = 1, limit = 10, machine_id, type, status, priority, scheduled_by, q } = {}) {
    const where = [];
    const params = [];
    
    if (machine_id !== undefined) { 
      where.push('mm.machine_id = ?'); 
      params.push(machine_id); 
    }
    if (type) { 
      where.push('mm.type = ?'); 
      params.push(type); 
    }
    if (status) { 
      where.push('mm.status = ?'); 
      params.push(status); 
    }
    if (priority) { 
      where.push('mm.priority = ?'); 
      params.push(priority); 
    }
    if (scheduled_by !== undefined) { 
      where.push('mm.scheduled_by = ?'); 
      params.push(scheduled_by); 
    }
    if (q) { 
      where.push('(mm.title LIKE ? OR mm.description LIKE ?)'); 
      params.push(`%${q}%`, `%${q}%`); 
    }
    
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const offset = (Number(page) - 1) * Number(limit);
    
    const rows = await query(
      `SELECT 
        mm.maintenance_id, mm.machine_id, mm.title, mm.description, mm.type, mm.status, mm.priority,
        mm.scheduled_by, mm.estimated_duration_hours, mm.actual_duration_hours, 
        mm.estimated_cost, mm.actual_cost, mm.scheduled_date, mm.due_date, 
        mm.started_at, mm.completed_at, mm.created_at, mm.updated_at,
        m.title as machine_title,
        CONCAT(u.first_name, ' ', u.last_name) as scheduled_by_name
       FROM machine_maintenance mm 
       JOIN machines m ON m.machine_id = mm.machine_id 
       JOIN users u ON u.user_id = mm.scheduled_by
       ${whereSql} 
       ORDER BY mm.maintenance_id DESC 
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)]
    );
    
    const [{ count }] = await query(
      `SELECT COUNT(*) as count FROM machine_maintenance mm ${whereSql}`,
      params
    );
    
    return { 
      rows, 
      total: count, 
      page: Number(page), 
      limit: Number(limit) 
    };
  },

  async update(id, { title, description, type, status, priority, estimated_duration_hours, actual_duration_hours, estimated_cost, actual_cost, scheduled_date, due_date, started_at, completed_at }) {
    await query(
      `UPDATE machine_maintenance SET 
        title = ?, description = ?, type = ?, status = ?, priority = ?,
        estimated_duration_hours = ?, actual_duration_hours = ?, 
        estimated_cost = ?, actual_cost = ?, scheduled_date = ?, due_date = ?,
        started_at = ?, completed_at = ?, updated_at = NOW()
       WHERE maintenance_id = ?`,
      [title, description, type, status, priority, estimated_duration_hours, actual_duration_hours, estimated_cost, actual_cost, scheduled_date, due_date, started_at, completed_at, id]
    );
    
    const rows = await query('SELECT * FROM machine_maintenance WHERE maintenance_id = ?', [id]);
    return rows[0];
  },

  async updateStatus(id, status) {
    const updateFields = ['status = ?', 'updated_at = NOW()'];
    const params = [status];
    
    // Set timestamps based on status
    if (status === 'in_progress') {
      updateFields.push('started_at = NOW()');
    } else if (status === 'completed') {
      updateFields.push('completed_at = NOW()');
      // Also set started_at if not already set
      updateFields.push('started_at = COALESCE(started_at, NOW())');
    }
    
    params.push(id);
    
    await query(
      `UPDATE machine_maintenance SET ${updateFields.join(', ')} WHERE maintenance_id = ?`,
      params
    );
    
    const rows = await query('SELECT * FROM machine_maintenance WHERE maintenance_id = ?', [id]);
    return rows[0];
  },

  async remove(id) {
    await query('DELETE FROM machine_maintenance WHERE maintenance_id = ?', [id]);
  },

  async getUpcoming({ page = 1, limit = 10, machine_id, type, priority } = {}) {
    const where = ['mm.scheduled_date >= CURDATE()', "mm.status IN ('scheduled', 'in_progress')"];
    const params = [];
    
    if (machine_id !== undefined) { 
      where.push('mm.machine_id = ?'); 
      params.push(machine_id); 
    }
    if (type) { 
      where.push('mm.type = ?'); 
      params.push(type); 
    }
    if (priority) { 
      where.push('mm.priority = ?'); 
      params.push(priority); 
    }
    
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const offset = (Number(page) - 1) * Number(limit);
    
    const rows = await query(
      `SELECT 
        mm.maintenance_id, mm.machine_id, mm.title, mm.description, mm.type, mm.status, mm.priority,
        mm.scheduled_by, mm.estimated_duration_hours, mm.actual_duration_hours, 
        mm.estimated_cost, mm.actual_cost, mm.scheduled_date, mm.due_date, 
        mm.started_at, mm.completed_at, mm.created_at, mm.updated_at,
        m.title as machine_title,
        CONCAT(u.first_name, ' ', u.last_name) as scheduled_by_name
       FROM machine_maintenance mm 
       JOIN machines m ON m.machine_id = mm.machine_id 
       JOIN users u ON u.user_id = mm.scheduled_by
       ${whereSql} 
       ORDER BY mm.scheduled_date ASC 
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)]
    );
    
    const [{ count }] = await query(
      `SELECT COUNT(*) as count FROM machine_maintenance mm ${whereSql}`,
      params
    );
    
    return { 
      rows, 
      total: count, 
      page: Number(page), 
      limit: Number(limit) 
    };
  }
};