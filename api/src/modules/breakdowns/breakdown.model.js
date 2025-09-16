import { query } from '../../config/db.config.js';

export const BreakdownModel = {
  async create(breakdownData) {
    const {
      machine_id,
      title,
      description,
      category_id,
      severity,
      reported_by,
      estimated_downtime_hours,
      estimated_repair_cost,
      breakdown_start_time
    } = breakdownData;

    // Get default status (Reported)
    const [reportedStatus] = await query(
      'SELECT status_id FROM breakdown_statuses WHERE name = ? LIMIT 1',
      ['Reported']
    );

    const statusId = reportedStatus ? reportedStatus.status_id : 1;

    const sql = `
      INSERT INTO machine_breakdowns (
        machine_id, title, description, category_id, status_id, severity, reported_by,
        estimated_downtime_hours, estimated_repair_cost, breakdown_start_time,
        reported_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())
    `;

    const result = await query(sql, [
      machine_id,
      title,
      description,
      category_id,
      statusId,
      severity,
      reported_by,
      estimated_downtime_hours,
      estimated_repair_cost,
      breakdown_start_time
    ]);

    return { breakdown_id: result.insertId, ...breakdownData, status_id: statusId };
  },

  async list({
    page = 1,
    limit = 10,
    status_id,
    category_id,
    reported_by,
    assigned_to,
    machine_id,
    division_id,
    severity,
    q,
    is_active,
    date_from,
    date_to,
    sort_by = 'created_at',
    sort_order = 'desc'
  } = {}) {
    const where = [];
    const params = [];

    if (status_id !== undefined) {
      where.push('mb.status_id = ?');
      params.push(status_id);
    }
    if (category_id !== undefined) {
      where.push('mb.category_id = ?');
      params.push(category_id);
    }
    if (reported_by !== undefined) {
      where.push('mb.reported_by = ?');
      params.push(reported_by);
    }
    if (assigned_to !== undefined) {
      where.push('mb.assigned_to = ?');
      params.push(assigned_to);
    }
    if (machine_id !== undefined) {
      where.push('mb.machine_id = ?');
      params.push(machine_id);
    }
    if (division_id !== undefined) {
      where.push('m.division_id = ?');
      params.push(division_id);
    }
    if (severity !== undefined) {
      where.push('mb.severity = ?');
      params.push(severity);
    }
    if (is_active === true) {
      where.push('mb.breakdown_end_time IS NULL');
    }
    if (is_active === false) {
      where.push('mb.breakdown_end_time IS NOT NULL');
    }
    if (date_from) {
      where.push('mb.breakdown_start_time >= ?');
      params.push(date_from);
    }
    if (date_to) {
      where.push('mb.breakdown_start_time <= ?');
      params.push(date_to);
    }
    if (q) {
      where.push('(mb.title LIKE ? OR mb.description LIKE ?)');
      params.push(`%${q}%`, `%${q}%`);
    }

    const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

    const validSortColumns = [
      'created_at',
      'breakdown_start_time',
      'title',
      'severity',
      'status_id'
    ];
    const sortColumn = validSortColumns.includes(sort_by) ? sort_by : 'created_at';
    const sortDirection = sort_order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    const countSql = `
      SELECT COUNT(*) as total
      FROM machine_breakdowns mb
      JOIN machines m ON mb.machine_id = m.machine_id
      JOIN divisions d ON m.division_id = d.division_id
      ${whereClause}
    `;

    const [{ total }] = await query(countSql, params);

    const offset = (page - 1) * limit;
    params.push(limit, offset);

    const sql = `
      SELECT 
        mb.breakdown_id, mb.title, mb.description, mb.severity,
        mb.estimated_downtime_hours, mb.actual_downtime_hours,
        mb.estimated_repair_cost, mb.actual_repair_cost,
        mb.breakdown_start_time, mb.breakdown_end_time,
        mb.reported_at, mb.assigned_at, mb.repair_started_at, 
        mb.repair_completed_at, mb.verified_at,
        mb.created_at, mb.updated_at,
        
        bc.category_id, bc.name as category_name,
        bs.status_id, bs.name as status_name,
        
        m.machine_id, m.title as machine_title,
        d.division_id, d.title as division_title,
        
        ur.user_id as reported_by_id, ur.first_name as reported_by_first_name, 
        ur.last_name as reported_by_last_name, ur.email as reported_by_email,
        
        ua.user_id as assigned_to_id, ua.first_name as assigned_to_first_name, 
        ua.last_name as assigned_to_last_name, ua.email as assigned_to_email
        
      FROM machine_breakdowns mb
      LEFT JOIN breakdown_categories bc ON mb.category_id = bc.category_id
      LEFT JOIN breakdown_statuses bs ON mb.status_id = bs.status_id
      LEFT JOIN machines m ON mb.machine_id = m.machine_id
      LEFT JOIN divisions d ON m.division_id = d.division_id
      LEFT JOIN users ur ON mb.reported_by = ur.user_id
      LEFT JOIN users ua ON mb.assigned_to = ua.user_id
      ${whereClause}
      ORDER BY mb.${sortColumn} ${sortDirection}
      LIMIT ? OFFSET ?
    `;

    console.log(sql)

    const breakdowns = await query(sql, params);

    return {
      data: breakdowns.map((row) => ({
        breakdown_id: row.breakdown_id,
        title: row.title,
        description: row.description,
        severity: row.severity,
        estimated_downtime_hours: row.estimated_downtime_hours,
        actual_downtime_hours: row.actual_downtime_hours,
        estimated_repair_cost: row.estimated_repair_cost,
        actual_repair_cost: row.actual_repair_cost,
        breakdown_start_time: row.breakdown_start_time,
        breakdown_end_time: row.breakdown_end_time,
        reported_at: row.reported_at,
        assigned_at: row.assigned_at,
        repair_started_at: row.repair_started_at,
        repair_completed_at: row.repair_completed_at,
        verified_at: row.verified_at,
        created_at: row.created_at,
        updated_at: row.updated_at,
        category: {
          category_id: row.category_id,
          name: row.category_name
        },
        status: {
          status_id: row.status_id,
          name: row.status_name
        },
        machine: {
          machine_id: row.machine_id,
          title: row.machine_title,
          division: {
            division_id: row.division_id,
            title: row.division_title
          }
        },
        reported_by: {
          user_id: row.reported_by_id,
          first_name: row.reported_by_first_name,
          last_name: row.reported_by_last_name,
          email: row.reported_by_email
        },
        assigned_to: row.assigned_to_id
          ? {
              user_id: row.assigned_to_id,
              first_name: row.assigned_to_first_name,
              last_name: row.assigned_to_last_name,
              email: row.assigned_to_email
            }
          : null
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  async getById(id) {
    const sql = `
      SELECT 
        mb.*, 
        bc.name as category_name,
        bs.name as status_name,
        m.title as machine_title,
        d.division_id, d.title as division_title,
        ur.first_name as reported_by_first_name, ur.last_name as reported_by_last_name, ur.email as reported_by_email,
        ua.first_name as assigned_to_first_name, ua.last_name as assigned_to_last_name, ua.email as assigned_to_email
      FROM machine_breakdowns mb
      JOIN breakdown_categories bc ON mb.category_id = bc.category_id
      JOIN breakdown_statuses bs ON mb.status_id = bs.status_id
      JOIN machines m ON mb.machine_id = m.machine_id
      JOIN divisions d ON m.division_id = d.division_id
      JOIN users ur ON mb.reported_by = ur.user_id
      LEFT JOIN users ua ON mb.assigned_to = ua.user_id
      WHERE mb.breakdown_id = ?
    `;

    const rows = await query(sql, [id]);
    if (rows.length === 0) return null;

    const row = rows[0];
    return {
      breakdown_id: row.breakdown_id,
      title: row.title,
      description: row.description,
      severity: row.severity,
      estimated_downtime_hours: row.estimated_downtime_hours,
      actual_downtime_hours: row.actual_downtime_hours,
      estimated_repair_cost: row.estimated_repair_cost,
      actual_repair_cost: row.actual_repair_cost,
      breakdown_start_time: row.breakdown_start_time,
      breakdown_end_time: row.breakdown_end_time,
      reported_at: row.reported_at,
      assigned_at: row.assigned_at,
      repair_started_at: row.repair_started_at,
      repair_completed_at: row.repair_completed_at,
      verified_at: row.verified_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
      category: {
        category_id: row.category_id,
        name: row.category_name
      },
      status: {
        status_id: row.status_id,
        name: row.status_name
      },
      machine: {
        machine_id: row.machine_id,
        title: row.machine_title,
        division: {
          division_id: row.division_id,
          title: row.division_title
        }
      },
      reported_by: {
        user_id: row.reported_by,
        first_name: row.reported_by_first_name,
        last_name: row.reported_by_last_name,
        email: row.reported_by_email
      },
      assigned_to: row.assigned_to
        ? {
            user_id: row.assigned_to,
            first_name: row.assigned_to_first_name,
            last_name: row.assigned_to_last_name,
            email: row.assigned_to_email
          }
        : null
    };
  },

  async update(id, updateData) {
    const {
      title,
      description,
      category_id,
      severity,
      assigned_to,
      estimated_downtime_hours,
      actual_downtime_hours,
      estimated_repair_cost,
      actual_repair_cost,
      breakdown_end_time
    } = updateData;

    const sql = `
      UPDATE machine_breakdowns 
      SET title = ?, description = ?, category_id = ?, severity = ?, assigned_to = ?,
          estimated_downtime_hours = ?, actual_downtime_hours = ?,
          estimated_repair_cost = ?, actual_repair_cost = ?,
          breakdown_end_time = ?, updated_at = NOW()
      WHERE breakdown_id = ?
    `;

    await query(sql, [
      title,
      description,
      category_id,
      severity,
      assigned_to,
      estimated_downtime_hours,
      actual_downtime_hours,
      estimated_repair_cost,
      actual_repair_cost,
      breakdown_end_time,
      id
    ]);

    return this.getById(id);
  },

  async updateStatus(id, status_id, user_id) {
    let additionalUpdates = '';
    const now = new Date().toISOString();

    // Get status name
    const [status] = await query('SELECT name FROM breakdown_statuses WHERE status_id = ?', [
      status_id
    ]);

    if (status) {
      switch (status.name.toLowerCase()) {
        case 'assigned':
          additionalUpdates = ', assigned_at = NOW()';
          break;
        case 'in repair':
          additionalUpdates = ', repair_started_at = NOW()';
          break;
        case 'completed':
          additionalUpdates = ', repair_completed_at = NOW()';
          break;
        case 'verified':
          additionalUpdates = ', verified_at = NOW()';
          break;
      }
    }

    const sql = `
      UPDATE machine_breakdowns 
      SET status_id = ?, updated_at = NOW() ${additionalUpdates}
      WHERE breakdown_id = ?
    `;

    await query(sql, [status_id, id]);
    return this.getById(id);
  },

  async assign(id, assigned_to, user_id) {
    const sql = `
      UPDATE machine_breakdowns 
      SET assigned_to = ?, assigned_at = NOW(), updated_at = NOW()
      WHERE breakdown_id = ?
    `;

    await query(sql, [assigned_to, id]);
    return this.getById(id);
  },

  async startRepair(id, user_id) {
    // Get 'In Repair' status
    const [inRepairStatus] = await query(
      'SELECT status_id FROM breakdown_statuses WHERE name = ? LIMIT 1',
      ['In Repair']
    );

    if (inRepairStatus) {
      const sql = `
        UPDATE machine_breakdowns 
        SET status_id = ?, repair_started_at = NOW(), updated_at = NOW()
        WHERE breakdown_id = ?
      `;

      await query(sql, [inRepairStatus.status_id, id]);
    }

    return this.getById(id);
  },

  async completeRepair(id, user_id, actual_data = {}) {
    const { actual_downtime_hours, actual_repair_cost } = actual_data;

    // Get 'Completed' status
    const [completedStatus] = await query(
      'SELECT status_id FROM breakdown_statuses WHERE name = ? LIMIT 1',
      ['Completed']
    );

    let sql = `
      UPDATE machine_breakdowns 
      SET repair_completed_at = NOW(), breakdown_end_time = NOW(), updated_at = NOW()
    `;
    let params = [];

    if (completedStatus) {
      sql += `, status_id = ?`;
      params.push(completedStatus.status_id);
    }

    if (actual_downtime_hours !== undefined) {
      sql += `, actual_downtime_hours = ?`;
      params.push(actual_downtime_hours);
    }

    if (actual_repair_cost !== undefined) {
      sql += `, actual_repair_cost = ?`;
      params.push(actual_repair_cost);
    }

    sql += ` WHERE breakdown_id = ?`;
    params.push(id);

    await query(sql, params);
    return this.getById(id);
  },

  async remove(id) {
    await query('DELETE FROM machine_breakdowns WHERE breakdown_id = ?', [id]);
  }
};
