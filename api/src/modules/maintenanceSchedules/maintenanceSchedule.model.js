import { pool as db } from '../../config/db.config.js';

const MaintenanceSchedule = {
  // Get all maintenance schedules with details
  getAll: async (filters = {}) => {
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (filters.machine_id) {
      whereClause += ' AND ms.machine_id = ?';
      params.push(filters.machine_id);
    }

    if (filters.maintenance_type_id) {
      whereClause += ' AND ms.maintenance_type_id = ?';
      params.push(filters.maintenance_type_id);
    }

    if (filters.is_active !== undefined) {
      whereClause += ' AND ms.is_active = ?';
      params.push(filters.is_active);
    }

    if (filters.overdue) {
      whereClause += ' AND ms.next_due_date < CURDATE() AND ms.is_active = 1';
    }

    if (filters.due_within_days) {
      whereClause += ' AND ms.next_due_date <= DATE_ADD(CURDATE(), INTERVAL ? DAY) AND ms.is_active = 1';
      params.push(filters.due_within_days);
    }

    const query = `
      SELECT 
        ms.schedule_id,
        ms.machine_id,
        m.title as machine_title,
        d.title as division_title,
        ms.maintenance_type_id,
        mt.name as maintenance_type_name,
        mt.description as maintenance_type_description,
        ms.frequency_days,
        ms.next_due_date,
        ms.last_completed_date,
        ms.is_active,
        ms.assigned_to,
        CONCAT(assigned_user.first_name, ' ', assigned_user.last_name) as assigned_user_name,
        ms.created_by,
        CONCAT(created_user.first_name, ' ', created_user.last_name) as created_user_name,
        ms.created_at,
        ms.updated_at,
        CASE 
          WHEN ms.next_due_date < CURDATE() THEN 'overdue'
          WHEN ms.next_due_date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY) THEN 'due_soon'
          ELSE 'scheduled'
        END as status
      FROM maintenance_schedules ms
      JOIN machines m ON ms.machine_id = m.machine_id
      JOIN divisions d ON m.division_id = d.division_id
      JOIN maintenance_types mt ON ms.maintenance_type_id = mt.maintenance_type_id
      LEFT JOIN users assigned_user ON ms.assigned_to = assigned_user.user_id
      LEFT JOIN users created_user ON ms.created_by = created_user.user_id
      ${whereClause}
      ORDER BY ms.next_due_date ASC, m.title ASC
    `;
    
    const [rows] = await db.execute(query, params);
    return rows;
  },

  // Get schedule by ID
  getById: async (id) => {
    const query = `
      SELECT 
        ms.schedule_id,
        ms.machine_id,
        m.title as machine_title,
        d.title as division_title,
        ms.maintenance_type_id,
        mt.name as maintenance_type_name,
        mt.description as maintenance_type_description,
        ms.frequency_days,
        ms.next_due_date,
        ms.last_completed_date,
        ms.is_active,
        ms.assigned_to,
        CONCAT(assigned_user.first_name, ' ', assigned_user.last_name) as assigned_user_name,
        ms.created_by,
        CONCAT(created_user.first_name, ' ', created_user.last_name) as created_user_name,
        ms.created_at,
        ms.updated_at
      FROM maintenance_schedules ms
      JOIN machines m ON ms.machine_id = m.machine_id
      JOIN divisions d ON m.division_id = d.division_id
      JOIN maintenance_types mt ON ms.maintenance_type_id = mt.maintenance_type_id
      LEFT JOIN users assigned_user ON ms.assigned_to = assigned_user.user_id
      LEFT JOIN users created_user ON ms.created_by = created_user.user_id
      WHERE ms.schedule_id = ?
    `;
    
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  },

  // Create new maintenance schedule
  create: async (scheduleData) => {
    const { 
      machine_id, 
      maintenance_type_id, 
      frequency_days, 
      next_due_date, 
      assigned_to, 
      created_by 
    } = scheduleData;
    
    const query = `
      INSERT INTO maintenance_schedules 
      (machine_id, maintenance_type_id, frequency_days, next_due_date, assigned_to, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.execute(query, [
      machine_id, 
      maintenance_type_id, 
      frequency_days, 
      next_due_date, 
      assigned_to, 
      created_by
    ]);
    
    return result.insertId;
  },

  // Update maintenance schedule
  update: async (id, scheduleData) => {
    const { 
      machine_id, 
      maintenance_type_id, 
      frequency_days, 
      next_due_date, 
      last_completed_date,
      is_active,
      assigned_to 
    } = scheduleData;
    
    const query = `
      UPDATE maintenance_schedules 
      SET machine_id = ?, maintenance_type_id = ?, frequency_days = ?, 
          next_due_date = ?, last_completed_date = ?, is_active = ?, assigned_to = ?
      WHERE schedule_id = ?
    `;
    
    const [result] = await db.execute(query, [
      machine_id, 
      maintenance_type_id, 
      frequency_days, 
      next_due_date, 
      last_completed_date,
      is_active,
      assigned_to,
      id
    ]);
    
    return result.affectedRows > 0;
  },

  // Delete maintenance schedule
  delete: async (id) => {
    const query = `DELETE FROM maintenance_schedules WHERE schedule_id = ?`;
    const [result] = await db.execute(query, [id]);
    
    return result.affectedRows > 0;
  },

  // Update next due date after maintenance completion
  updateNextDueDate: async (id, completedDate) => {
    const query = `
      UPDATE maintenance_schedules 
      SET last_completed_date = ?, 
          next_due_date = DATE_ADD(?, INTERVAL frequency_days DAY)
      WHERE schedule_id = ?
    `;
    
    const [result] = await db.execute(query, [completedDate, completedDate, id]);
    return result.affectedRows > 0;
  },

  // Get schedules by machine
  getByMachine: async (machineId) => {
    const query = `
      SELECT 
        ms.schedule_id,
        ms.maintenance_type_id,
        mt.name as maintenance_type_name,
        ms.frequency_days,
        ms.next_due_date,
        ms.last_completed_date,
        ms.is_active,
        ms.assigned_to,
        CONCAT(u.first_name, ' ', u.last_name) as assigned_user_name
      FROM maintenance_schedules ms
      JOIN maintenance_types mt ON ms.maintenance_type_id = mt.maintenance_type_id
      LEFT JOIN users u ON ms.assigned_to = u.user_id
      WHERE ms.machine_id = ? AND ms.is_active = 1
      ORDER BY ms.next_due_date ASC
    `;
    
    const [rows] = await db.execute(query, [machineId]);
    return rows;
  },

  // Check for existing schedule for same machine and maintenance type
  checkDuplicate: async (machineId, maintenanceTypeId, excludeId = null) => {
    let query = `
      SELECT schedule_id 
      FROM maintenance_schedules 
      WHERE machine_id = ? AND maintenance_type_id = ? AND is_active = 1
    `;
    const params = [machineId, maintenanceTypeId];

    if (excludeId) {
      query += ' AND schedule_id != ?';
      params.push(excludeId);
    }
    
    const [rows] = await db.execute(query, params);
    return rows.length > 0;
  }
};

export default MaintenanceSchedule;