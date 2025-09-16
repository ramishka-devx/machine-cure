import { pool as db } from '../../config/db.config.js';

const MaintenanceType = {
  // Get all maintenance types
  getAll: async () => {
    const query = `
      SELECT 
        maintenance_type_id,
        name,
        description,
        default_frequency_days,
        estimated_duration_hours,
        created_at,
        updated_at
      FROM maintenance_types 
      ORDER BY name ASC
    `;
    
    const [rows] = await db.execute(query);
    return rows;
  },

  // Get maintenance type by ID
  getById: async (id) => {
    const query = `
      SELECT 
        maintenance_type_id,
        name,
        description,
        default_frequency_days,
        estimated_duration_hours,
        created_at,
        updated_at
      FROM maintenance_types 
      WHERE maintenance_type_id = ?
    `;
    
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  },

  // Create new maintenance type
  create: async (maintenanceTypeData) => {
    const { name, description, default_frequency_days, estimated_duration_hours } = maintenanceTypeData;
    
    const query = `
      INSERT INTO maintenance_types 
      (name, description, default_frequency_days, estimated_duration_hours)
      VALUES (?, ?, ?, ?)
    `;
    
    const [result] = await db.execute(query, [
      name, 
      description, 
      default_frequency_days,
      estimated_duration_hours || 0
    ]);
    
    return result.insertId;
  },

  // Update maintenance type
  update: async (id, maintenanceTypeData) => {
    const { name, description, default_frequency_days, estimated_duration_hours } = maintenanceTypeData;
    
    const query = `
      UPDATE maintenance_types 
      SET name = ?, description = ?, default_frequency_days = ?, estimated_duration_hours = ?
      WHERE maintenance_type_id = ?
    `;
    
    const [result] = await db.execute(query, [
      name, 
      description, 
      default_frequency_days,
      estimated_duration_hours || 0,
      id
    ]);
    
    return result.affectedRows > 0;
  },

  // Delete maintenance type
  delete: async (id) => {
    // Check if maintenance type is being used
    const checkQuery = `
      SELECT COUNT(*) as count 
      FROM maintenance_schedules 
      WHERE maintenance_type_id = ?
    `;
    
    const [checkResult] = await db.execute(checkQuery, [id]);
    
    if (checkResult[0].count > 0) {
      throw new Error('Cannot delete maintenance type that is being used in schedules');
    }
    
    const query = `DELETE FROM maintenance_types WHERE maintenance_type_id = ?`;
    const [result] = await db.execute(query, [id]);
    
    return result.affectedRows > 0;
  },

  // Get maintenance types with usage statistics
  getWithStats: async () => {
    const query = `
      SELECT 
        mt.maintenance_type_id,
        mt.name,
        mt.description,
        mt.default_frequency_days,
        mt.estimated_duration_hours,
        COUNT(ms.schedule_id) as schedule_count,
        COUNT(mr.maintenance_id) as maintenance_count,
        mt.created_at,
        mt.updated_at
      FROM maintenance_types mt
      LEFT JOIN maintenance_schedules ms ON mt.maintenance_type_id = ms.maintenance_type_id
      LEFT JOIN maintenance_records mr ON mt.maintenance_type_id = mr.maintenance_type_id
      GROUP BY mt.maintenance_type_id
      ORDER BY mt.name ASC
    `;
    
    const [rows] = await db.execute(query);
    return rows;
  }
};

export default MaintenanceType;