import { pool as db } from '../../config/db.config.js';

const Part = {
  // Get all parts
  getAll: async (filters = {}) => {
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (filters.category) {
      whereClause += ' AND p.category = ?';
      params.push(filters.category);
    }

    if (filters.supplier) {
      whereClause += ' AND p.supplier LIKE ?';
      params.push(`%${filters.supplier}%`);
    }

    if (filters.search) {
      whereClause += ' AND (p.name LIKE ? OR p.part_number LIKE ? OR p.description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.low_stock) {
      whereClause += ' AND p.current_stock_level <= p.minimum_stock_level';
    }

    const query = `
      SELECT 
        p.part_id,
        p.part_number,
        p.name,
        p.description,
        p.unit_price,
        p.supplier,
        p.category,
        p.minimum_stock_level,
        p.current_stock_level,
        p.unit,
        p.created_at,
        p.updated_at,
        CASE 
          WHEN p.current_stock_level <= 0 THEN 'out_of_stock'
          WHEN p.current_stock_level <= p.minimum_stock_level THEN 'low_stock'
          ELSE 'in_stock'
        END as stock_status
      FROM parts p
      ${whereClause}
      ORDER BY p.name ASC
    `;
    
    const [rows] = await db.execute(query, params);
    return rows;
  },

  // Get part by ID
  getById: async (id) => {
    const query = `
      SELECT 
        p.part_id,
        p.part_number,
        p.name,
        p.description,
        p.unit_price,
        p.supplier,
        p.category,
        p.minimum_stock_level,
        p.current_stock_level,
        p.unit,
        p.created_at,
        p.updated_at,
        CASE 
          WHEN p.current_stock_level <= 0 THEN 'out_of_stock'
          WHEN p.current_stock_level <= p.minimum_stock_level THEN 'low_stock'
          ELSE 'in_stock'
        END as stock_status
      FROM parts p
      WHERE p.part_id = ?
    `;
    
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  },

  // Get part by part number
  getByPartNumber: async (partNumber) => {
    const query = `
      SELECT 
        p.part_id,
        p.part_number,
        p.name,
        p.description,
        p.unit_price,
        p.supplier,
        p.category,
        p.minimum_stock_level,
        p.current_stock_level,
        p.unit,
        p.created_at,
        p.updated_at
      FROM parts p
      WHERE p.part_number = ?
    `;
    
    const [rows] = await db.execute(query, [partNumber]);
    return rows[0];
  },

  // Create new part
  create: async (partData) => {
    const { 
      part_number, 
      name, 
      description, 
      unit_price, 
      supplier, 
      category,
      minimum_stock_level,
      current_stock_level,
      unit
    } = partData;
    
    const query = `
      INSERT INTO parts 
      (part_number, name, description, unit_price, supplier, category, 
       minimum_stock_level, current_stock_level, unit)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.execute(query, [
      part_number, 
      name, 
      description, 
      unit_price || 0, 
      supplier, 
      category,
      minimum_stock_level || 0,
      current_stock_level || 0,
      unit
    ]);
    
    return result.insertId;
  },

  // Update part
  update: async (id, partData) => {
    const { 
      part_number, 
      name, 
      description, 
      unit_price, 
      supplier, 
      category,
      minimum_stock_level,
      current_stock_level,
      unit
    } = partData;
    
    const query = `
      UPDATE parts 
      SET part_number = ?, name = ?, description = ?, unit_price = ?, 
          supplier = ?, category = ?, minimum_stock_level = ?, 
          current_stock_level = ?, unit = ?
      WHERE part_id = ?
    `;
    
    const [result] = await db.execute(query, [
      part_number, 
      name, 
      description, 
      unit_price, 
      supplier, 
      category,
      minimum_stock_level,
      current_stock_level,
      unit,
      id
    ]);
    
    return result.affectedRows > 0;
  },

  // Delete part
  delete: async (id) => {
    // Check if part is being used in maintenance
    const checkQuery = `
      SELECT COUNT(*) as count 
      FROM maintenance_parts_used 
      WHERE part_id = ?
    `;
    
    const [checkResult] = await db.execute(checkQuery, [id]);
    
    if (checkResult[0].count > 0) {
      throw new Error('Cannot delete part that has been used in maintenance');
    }

    const query = `DELETE FROM parts WHERE part_id = ?`;
    const [result] = await db.execute(query, [id]);
    
    return result.affectedRows > 0;
  },

  // Update stock level
  updateStock: async (id, quantity, operation = 'set') => {
    let query;
    const params = [id];

    if (operation === 'add') {
      query = `UPDATE parts SET current_stock_level = current_stock_level + ? WHERE part_id = ?`;
      params.unshift(quantity);
    } else if (operation === 'subtract') {
      query = `UPDATE parts SET current_stock_level = GREATEST(0, current_stock_level - ?) WHERE part_id = ?`;
      params.unshift(quantity);
    } else {
      query = `UPDATE parts SET current_stock_level = ? WHERE part_id = ?`;
      params.unshift(quantity);
    }
    
    const [result] = await db.execute(query, params);
    return result.affectedRows > 0;
  },

  // Get low stock parts
  getLowStock: async () => {
    const query = `
      SELECT 
        p.part_id,
        p.part_number,
        p.name,
        p.minimum_stock_level,
        p.current_stock_level,
        p.supplier,
        p.unit_price
      FROM parts p
      WHERE p.current_stock_level <= p.minimum_stock_level
      ORDER BY (p.current_stock_level - p.minimum_stock_level) ASC
    `;
    
    const [rows] = await db.execute(query);
    return rows;
  },

  // Get parts by category
  getByCategory: async () => {
    const query = `
      SELECT 
        p.category,
        COUNT(*) as part_count,
        SUM(p.current_stock_level * p.unit_price) as total_value,
        AVG(p.unit_price) as avg_price
      FROM parts p
      WHERE p.category IS NOT NULL
      GROUP BY p.category
      ORDER BY p.category ASC
    `;
    
    const [rows] = await db.execute(query);
    return rows;
  },

  // Get parts for machine
  getForMachine: async (machineId) => {
    const query = `
      SELECT 
        p.part_id,
        p.part_number,
        p.name,
        p.description,
        p.unit_price,
        p.current_stock_level,
        p.minimum_stock_level,
        mp.recommended_stock_level,
        CASE 
          WHEN p.current_stock_level <= 0 THEN 'out_of_stock'
          WHEN p.current_stock_level <= GREATEST(p.minimum_stock_level, mp.recommended_stock_level) THEN 'low_stock'
          ELSE 'in_stock'
        END as stock_status
      FROM parts p
      JOIN machine_parts mp ON p.part_id = mp.part_id
      WHERE mp.machine_id = ?
      ORDER BY p.name ASC
    `;
    
    const [rows] = await db.execute(query, [machineId]);
    return rows;
  },

  // Get part usage history
  getUsageHistory: async (partId, limit = 10) => {
    const query = `
      SELECT 
        mpu.usage_id,
        mpu.quantity_used,
        mpu.unit_cost,
        mpu.notes,
        mr.maintenance_id,
        mr.title as maintenance_title,
        m.title as machine_title,
        mr.completed_at,
        CONCAT(u.first_name, ' ', u.last_name) as performed_by_name
      FROM maintenance_parts_used mpu
      JOIN maintenance_records mr ON mpu.maintenance_id = mr.maintenance_id
      JOIN machines m ON mr.machine_id = m.machine_id
      LEFT JOIN users u ON mr.performed_by = u.user_id
      WHERE mpu.part_id = ?
      ORDER BY mr.completed_at DESC
      LIMIT ?
    `;
    
    const [rows] = await db.execute(query, [partId, limit]);
    return rows;
  },

  // Get inventory value
  getInventoryValue: async () => {
    const query = `
      SELECT 
        COUNT(*) as total_parts,
        SUM(current_stock_level * unit_price) as total_value,
        SUM(CASE WHEN current_stock_level <= minimum_stock_level THEN 1 ELSE 0 END) as low_stock_count,
        SUM(CASE WHEN current_stock_level <= 0 THEN 1 ELSE 0 END) as out_of_stock_count
      FROM parts
    `;
    
    const [rows] = await db.execute(query);
    return rows[0];
  }
};

export default Part;