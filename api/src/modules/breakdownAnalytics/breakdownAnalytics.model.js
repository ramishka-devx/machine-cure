import { query } from '../../config/db.config.js';

export const BreakdownAnalyticsModel = {
  async getSummary(date_from, date_to) {
    const dateFilter = date_from && date_to ? 
      'WHERE mb.breakdown_start_time BETWEEN ? AND ?' : '';
    const params = date_from && date_to ? [date_from, date_to] : [];

    const sql = `
      SELECT 
        COUNT(*) as total_breakdowns,
        COUNT(CASE WHEN mb.breakdown_end_time IS NULL THEN 1 END) as active_breakdowns,
        COUNT(CASE WHEN mb.breakdown_end_time IS NOT NULL THEN 1 END) as resolved_breakdowns,
        COUNT(CASE WHEN mb.severity = 'critical' THEN 1 END) as critical_breakdowns,
        COUNT(CASE WHEN mb.severity = 'high' THEN 1 END) as high_priority_breakdowns,
        AVG(CASE WHEN mb.breakdown_end_time IS NOT NULL 
            THEN TIMESTAMPDIFF(HOUR, mb.breakdown_start_time, mb.breakdown_end_time) 
            END) as avg_downtime_hours,
        SUM(COALESCE(mb.actual_repair_cost, mb.estimated_repair_cost, 0)) as total_repair_costs
      FROM machine_breakdowns mb
      ${dateFilter}
    `;

    const [summary] = await query(sql, params);
    return summary;
  },

  async getByMachine(date_from, date_to) {
    const dateFilter = date_from && date_to ? 
      'WHERE mb.breakdown_start_time BETWEEN ? AND ?' : '';
    const params = date_from && date_to ? [date_from, date_to] : [];

    const sql = `
      SELECT 
        m.machine_id,
        m.title as machine_title,
        d.title as division_title,
        COUNT(*) as breakdown_count,
        COUNT(CASE WHEN mb.breakdown_end_time IS NULL THEN 1 END) as active_breakdowns,
        AVG(CASE WHEN mb.breakdown_end_time IS NOT NULL 
            THEN TIMESTAMPDIFF(HOUR, mb.breakdown_start_time, mb.breakdown_end_time) 
            END) as avg_downtime_hours,
        SUM(COALESCE(mb.actual_repair_cost, mb.estimated_repair_cost, 0)) as total_repair_costs
      FROM machine_breakdowns mb
      JOIN machines m ON mb.machine_id = m.machine_id
      JOIN divisions d ON m.division_id = d.division_id
      ${dateFilter}
      GROUP BY m.machine_id, m.title, d.title
      ORDER BY breakdown_count DESC
    `;

    return query(sql, params);
  },

  async getByCategory(date_from, date_to) {
    const dateFilter = date_from && date_to ? 
      'WHERE mb.breakdown_start_time BETWEEN ? AND ?' : '';
    const params = date_from && date_to ? [date_from, date_to] : [];

    const sql = `
      SELECT 
        bc.category_id,
        bc.name as category_name,
        COUNT(*) as breakdown_count,
        COUNT(CASE WHEN mb.breakdown_end_time IS NULL THEN 1 END) as active_breakdowns,
        AVG(CASE WHEN mb.breakdown_end_time IS NOT NULL 
            THEN TIMESTAMPDIFF(HOUR, mb.breakdown_start_time, mb.breakdown_end_time) 
            END) as avg_downtime_hours,
        SUM(COALESCE(mb.actual_repair_cost, mb.estimated_repair_cost, 0)) as total_repair_costs
      FROM machine_breakdowns mb
      JOIN breakdown_categories bc ON mb.category_id = bc.category_id
      ${dateFilter}
      GROUP BY bc.category_id, bc.name
      ORDER BY breakdown_count DESC
    `;

    return query(sql, params);
  },

  async getByDivision(date_from, date_to) {
    const dateFilter = date_from && date_to ? 
      'WHERE mb.breakdown_start_time BETWEEN ? AND ?' : '';
    const params = date_from && date_to ? [date_from, date_to] : [];

    const sql = `
      SELECT 
        d.division_id,
        d.title as division_title,
        COUNT(*) as breakdown_count,
        COUNT(CASE WHEN mb.breakdown_end_time IS NULL THEN 1 END) as active_breakdowns,
        COUNT(DISTINCT m.machine_id) as machines_affected,
        AVG(CASE WHEN mb.breakdown_end_time IS NOT NULL 
            THEN TIMESTAMPDIFF(HOUR, mb.breakdown_start_time, mb.breakdown_end_time) 
            END) as avg_downtime_hours,
        SUM(COALESCE(mb.actual_repair_cost, mb.estimated_repair_cost, 0)) as total_repair_costs
      FROM machine_breakdowns mb
      JOIN machines m ON mb.machine_id = m.machine_id
      JOIN divisions d ON m.division_id = d.division_id
      ${dateFilter}
      GROUP BY d.division_id, d.title
      ORDER BY breakdown_count DESC
    `;

    return query(sql, params);
  },

  async getTrends(period = 'month', date_from, date_to) {
    const dateFilter = date_from && date_to ? 
      'WHERE mb.breakdown_start_time BETWEEN ? AND ?' : '';
    const params = date_from && date_to ? [date_from, date_to] : [];

    const groupBy = period === 'day' ? 
      'DATE(mb.breakdown_start_time)' : 
      'YEAR(mb.breakdown_start_time), MONTH(mb.breakdown_start_time)';

    const selectPeriod = period === 'day' ? 
      'DATE(mb.breakdown_start_time) as period' : 
      'CONCAT(YEAR(mb.breakdown_start_time), "-", LPAD(MONTH(mb.breakdown_start_time), 2, "0")) as period';

    const sql = `
      SELECT 
        ${selectPeriod},
        COUNT(*) as breakdown_count,
        COUNT(CASE WHEN mb.severity = 'critical' THEN 1 END) as critical_count,
        COUNT(CASE WHEN mb.severity = 'high' THEN 1 END) as high_count,
        AVG(CASE WHEN mb.breakdown_end_time IS NOT NULL 
            THEN TIMESTAMPDIFF(HOUR, mb.breakdown_start_time, mb.breakdown_end_time) 
            END) as avg_downtime_hours,
        SUM(COALESCE(mb.actual_repair_cost, mb.estimated_repair_cost, 0)) as total_costs
      FROM machine_breakdowns mb
      ${dateFilter}
      GROUP BY ${groupBy}
      ORDER BY period
    `;

    return query(sql, params);
  },

  async getMTBF(machine_id = null) {
    const machineFilter = machine_id ? 'WHERE m.machine_id = ?' : '';
    const params = machine_id ? [machine_id] : [];

    const sql = `
      SELECT 
        m.machine_id,
        m.title as machine_title,
        COUNT(*) as breakdown_count,
        DATEDIFF(NOW(), MIN(mb.breakdown_start_time)) as days_in_service,
        ROUND(DATEDIFF(NOW(), MIN(mb.breakdown_start_time)) / COUNT(*), 2) as mtbf_days
      FROM machine_breakdowns mb
      JOIN machines m ON mb.machine_id = m.machine_id
      ${machineFilter}
      GROUP BY m.machine_id, m.title
      HAVING breakdown_count > 0
      ORDER BY mtbf_days DESC
    `;

    return query(sql, params);
  },

  async getMTTR(machine_id = null) {
    const machineFilter = machine_id ? 'WHERE m.machine_id = ?' : '';
    const params = machine_id ? [machine_id] : [];

    const sql = `
      SELECT 
        m.machine_id,
        m.title as machine_title,
        COUNT(CASE WHEN mb.breakdown_end_time IS NOT NULL THEN 1 END) as resolved_breakdowns,
        AVG(CASE WHEN mb.breakdown_end_time IS NOT NULL 
            THEN TIMESTAMPDIFF(HOUR, mb.breakdown_start_time, mb.breakdown_end_time) 
            END) as mttr_hours
      FROM machine_breakdowns mb
      JOIN machines m ON mb.machine_id = m.machine_id
      ${machineFilter}
      GROUP BY m.machine_id, m.title
      HAVING resolved_breakdowns > 0
      ORDER BY mttr_hours ASC
    `;

    return query(sql, params);
  },

  async getProblematicMachines(limit = 10) {
    const sql = `
      SELECT 
        m.machine_id,
        m.title as machine_title,
        d.title as division_title,
        COUNT(*) as breakdown_count,
        COUNT(CASE WHEN mb.breakdown_end_time IS NULL THEN 1 END) as active_breakdowns,
        COUNT(CASE WHEN mb.severity IN ('critical', 'high') THEN 1 END) as high_priority_breakdowns,
        SUM(COALESCE(mb.actual_repair_cost, mb.estimated_repair_cost, 0)) as total_repair_costs,
        AVG(CASE WHEN mb.breakdown_end_time IS NOT NULL 
            THEN TIMESTAMPDIFF(HOUR, mb.breakdown_start_time, mb.breakdown_end_time) 
            END) as avg_downtime_hours
      FROM machine_breakdowns mb
      JOIN machines m ON mb.machine_id = m.machine_id
      JOIN divisions d ON m.division_id = d.division_id
      WHERE mb.breakdown_start_time >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
      GROUP BY m.machine_id, m.title, d.title
      ORDER BY breakdown_count DESC, high_priority_breakdowns DESC
      LIMIT ?
    `;

    return query(sql, [limit]);
  }
};