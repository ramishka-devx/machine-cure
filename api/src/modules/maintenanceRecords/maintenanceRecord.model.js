import { pool as db } from '../../config/db.config.js';

const MaintenanceRecord = {
  // Get all maintenance records with details
  getAll: async (filters = {}) => {
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (filters.machine_id) {
      whereClause += ' AND mr.machine_id = ?';
      params.push(filters.machine_id);
    }

    if (filters.maintenance_type_id) {
      whereClause += ' AND mr.maintenance_type_id = ?';
      params.push(filters.maintenance_type_id);
    }

    if (filters.status_id) {
      whereClause += ' AND mr.status_id = ?';
      params.push(filters.status_id);
    }

    if (filters.priority) {
      whereClause += ' AND mr.priority = ?';
      params.push(filters.priority);
    }

    if (filters.assigned_to) {
      whereClause += ' AND mr.assigned_to = ?';
      params.push(filters.assigned_to);
    }

    if (filters.performed_by) {
      whereClause += ' AND mr.performed_by = ?';
      params.push(filters.performed_by);
    }

    if (filters.date_from) {
      whereClause += ' AND mr.scheduled_date >= ?';
      params.push(filters.date_from);
    }

    if (filters.date_to) {
      whereClause += ' AND mr.scheduled_date <= ?';
      params.push(filters.date_to);
    }

    const query = `
      SELECT 
        mr.maintenance_id,
        mr.machine_id,
        m.title as machine_title,
        d.title as division_title,
        mr.maintenance_type_id,
        mt.name as maintenance_type_name,
        mr.schedule_id,
        mr.title,
        mr.description,
        mr.status_id,
        ms.name as status_name,
        mr.priority,
        mr.scheduled_date,
        mr.estimated_duration_hours,
        mr.actual_duration_hours,
        mr.estimated_cost,
        mr.actual_cost,
        mr.assigned_to,
        CONCAT(assigned_user.first_name, ' ', assigned_user.last_name) as assigned_user_name,
        mr.performed_by,
        CONCAT(performed_user.first_name, ' ', performed_user.last_name) as performed_user_name,
        mr.started_at,
        mr.completed_at,
        mr.notes,
        mr.created_at,
        mr.updated_at
      FROM maintenance_records mr
      JOIN machines m ON mr.machine_id = m.machine_id
      JOIN divisions d ON m.division_id = d.division_id
      JOIN maintenance_types mt ON mr.maintenance_type_id = mt.maintenance_type_id
      JOIN maintenance_statuses ms ON mr.status_id = ms.status_id
      LEFT JOIN maintenance_schedules sch ON mr.schedule_id = sch.schedule_id
      LEFT JOIN users assigned_user ON mr.assigned_to = assigned_user.user_id
      LEFT JOIN users performed_user ON mr.performed_by = performed_user.user_id
      ${whereClause}
      ORDER BY mr.scheduled_date DESC, mr.created_at DESC
    `;
    
    const [rows] = await db.execute(query, params);
    return rows;
  },

  // Get maintenance record by ID
  getById: async (id) => {
    const query = `
      SELECT 
        mr.maintenance_id,
        mr.machine_id,
        m.title as machine_title,
        d.title as division_title,
        mr.maintenance_type_id,
        mt.name as maintenance_type_name,
        mr.schedule_id,
        mr.title,
        mr.description,
        mr.status_id,
        ms.name as status_name,
        mr.priority,
        mr.scheduled_date,
        mr.estimated_duration_hours,
        mr.actual_duration_hours,
        mr.estimated_cost,
        mr.actual_cost,
        mr.assigned_to,
        CONCAT(assigned_user.first_name, ' ', assigned_user.last_name) as assigned_user_name,
        mr.performed_by,
        CONCAT(performed_user.first_name, ' ', performed_user.last_name) as performed_user_name,
        mr.started_at,
        mr.completed_at,
        mr.notes,
        mr.created_at,
        mr.updated_at
      FROM maintenance_records mr
      JOIN machines m ON mr.machine_id = m.machine_id
      JOIN divisions d ON m.division_id = d.division_id
      JOIN maintenance_types mt ON mr.maintenance_type_id = mt.maintenance_type_id
      JOIN maintenance_statuses ms ON mr.status_id = ms.status_id
      LEFT JOIN maintenance_schedules sch ON mr.schedule_id = sch.schedule_id
      LEFT JOIN users assigned_user ON mr.assigned_to = assigned_user.user_id
      LEFT JOIN users performed_user ON mr.performed_by = performed_user.user_id
      WHERE mr.maintenance_id = ?
    `;
    
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  },

  // Create new maintenance record
  create: async (recordData) => {
    const { 
      machine_id, 
      maintenance_type_id, 
      schedule_id,
      title, 
      description, 
      status_id,
      priority,
      scheduled_date,
      estimated_duration_hours,
      estimated_cost,
      assigned_to,
      notes
    } = recordData;
    
    const query = `
      INSERT INTO maintenance_records 
      (machine_id, maintenance_type_id, schedule_id, title, description, status_id, 
       priority, scheduled_date, estimated_duration_hours, estimated_cost, assigned_to, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.execute(query, [
      machine_id, 
      maintenance_type_id, 
      schedule_id,
      title, 
      description, 
      status_id,
      priority || 'medium',
      scheduled_date,
      estimated_duration_hours || 0,
      estimated_cost || 0,
      assigned_to,
      notes
    ]);
    
    return result.insertId;
  },

  // Update maintenance record
  update: async (id, recordData) => {
    const { 
      machine_id, 
      maintenance_type_id, 
      title, 
      description, 
      status_id,
      priority,
      scheduled_date,
      estimated_duration_hours,
      actual_duration_hours,
      estimated_cost,
      actual_cost,
      assigned_to,
      performed_by,
      started_at,
      completed_at,
      notes
    } = recordData;
    
    const query = `
      UPDATE maintenance_records 
      SET machine_id = ?, maintenance_type_id = ?, title = ?, description = ?, 
          status_id = ?, priority = ?, scheduled_date = ?, 
          estimated_duration_hours = ?, actual_duration_hours = ?, 
          estimated_cost = ?, actual_cost = ?, assigned_to = ?, performed_by = ?,
          started_at = ?, completed_at = ?, notes = ?
      WHERE maintenance_id = ?
    `;
    
    const [result] = await db.execute(query, [
      machine_id, 
      maintenance_type_id, 
      title, 
      description, 
      status_id,
      priority,
      scheduled_date,
      estimated_duration_hours,
      actual_duration_hours,
      estimated_cost,
      actual_cost,
      assigned_to,
      performed_by,
      started_at,
      completed_at,
      notes,
      id
    ]);
    
    return result.affectedRows > 0;
  },

  // Delete maintenance record
  delete: async (id) => {
    const query = `DELETE FROM maintenance_records WHERE maintenance_id = ?`;
    const [result] = await db.execute(query, [id]);
    
    return result.affectedRows > 0;
  },

  // Start maintenance work
  startMaintenance: async (id, userId) => {
    const query = `
      UPDATE maintenance_records 
      SET status_id = (SELECT status_id FROM maintenance_statuses WHERE name = 'in_progress'),
          performed_by = ?, 
          started_at = NOW()
      WHERE maintenance_id = ?
    `;
    
    const [result] = await db.execute(query, [userId, id]);
    return result.affectedRows > 0;
  },

  // Complete maintenance work
  completeMaintenance: async (id, completionData) => {
    const { performed_by, actual_duration_hours, actual_cost, notes } = completionData;
    
    const query = `
      UPDATE maintenance_records 
      SET status_id = (SELECT status_id FROM maintenance_statuses WHERE name = 'completed'),
          performed_by = ?, 
          actual_duration_hours = ?,
          actual_cost = ?,
          completed_at = NOW(),
          notes = CONCAT(COALESCE(notes, ''), ?)
      WHERE maintenance_id = ?
    `;
    
    const [result] = await db.execute(query, [
      performed_by, 
      actual_duration_hours, 
      actual_cost, 
      notes ? `\n\nCompletion Notes: ${notes}` : '',
      id
    ]);
    
    return result.affectedRows > 0;
  },

  // Get maintenance records by machine
  getByMachine: async (machineId, limit = 10) => {
    const query = `
      SELECT 
        mr.maintenance_id,
        mr.title,
        mt.name as maintenance_type_name,
        ms.name as status_name,
        mr.priority,
        mr.scheduled_date,
        mr.completed_at,
        CONCAT(u.first_name, ' ', u.last_name) as performed_by_name
      FROM maintenance_records mr
      JOIN maintenance_types mt ON mr.maintenance_type_id = mt.maintenance_type_id
      JOIN maintenance_statuses ms ON mr.status_id = ms.status_id
      LEFT JOIN users u ON mr.performed_by = u.user_id
      WHERE mr.machine_id = ?
      ORDER BY mr.scheduled_date DESC
      LIMIT ?
    `;
    
    const [rows] = await db.execute(query, [machineId, limit]);
    return rows;
  },

  // Get upcoming maintenance for user
  getUpcomingForUser: async (userId, days = 7) => {
    const query = `
      SELECT 
        mr.maintenance_id,
        mr.title,
        m.title as machine_title,
        mt.name as maintenance_type_name,
        mr.scheduled_date,
        mr.priority,
        ms.name as status_name
      FROM maintenance_records mr
      JOIN machines m ON mr.machine_id = m.machine_id
      JOIN maintenance_types mt ON mr.maintenance_type_id = mt.maintenance_type_id
      JOIN maintenance_statuses ms ON mr.status_id = ms.status_id
      WHERE mr.assigned_to = ? 
        AND mr.scheduled_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
        AND ms.name IN ('scheduled', 'in_progress')
      ORDER BY mr.scheduled_date ASC, mr.priority DESC
    `;
    
    const [rows] = await db.execute(query, [userId, days]);
    return rows;
  },

  // Get maintenance statistics
  getStatistics: async (filters = {}) => {
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (filters.date_from) {
      whereClause += ' AND mr.scheduled_date >= ?';
      params.push(filters.date_from);
    }

    if (filters.date_to) {
      whereClause += ' AND mr.scheduled_date <= ?';
      params.push(filters.date_to);
    }

    if (filters.machine_id) {
      whereClause += ' AND mr.machine_id = ?';
      params.push(filters.machine_id);
    }

    const query = `
      SELECT 
        COUNT(*) as total_records,
        SUM(CASE WHEN ms.name = 'completed' THEN 1 ELSE 0 END) as completed_count,
        SUM(CASE WHEN ms.name = 'in_progress' THEN 1 ELSE 0 END) as in_progress_count,
        SUM(CASE WHEN ms.name = 'scheduled' AND mr.scheduled_date < CURDATE() THEN 1 ELSE 0 END) as overdue_count,
        AVG(mr.actual_duration_hours) as avg_duration_hours,
        SUM(mr.actual_cost) as total_actual_cost,
        SUM(mr.estimated_cost) as total_estimated_cost
      FROM maintenance_records mr
      JOIN maintenance_statuses ms ON mr.status_id = ms.status_id
      ${whereClause}
    `;
    
    const [rows] = await db.execute(query, params);
    return rows[0];
  }
};

export default MaintenanceRecord;