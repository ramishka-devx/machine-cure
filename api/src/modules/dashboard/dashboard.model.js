import { query } from '../../config/db.config.js';

export const DashboardModel = {
  async getMetrics() {
    // Get machine count
    const [machineCount] = await query('SELECT COUNT(*) as count FROM machines');
    
    // Get user count
    const [userCount] = await query('SELECT COUNT(*) as count FROM users');
    
    // Get active breakdowns count
    const [activeBreakdowns] = await query(
      'SELECT COUNT(*) as count FROM machine_breakdowns WHERE breakdown_end_time IS NULL'
    );
    
    // Get today's maintenance count
    const today = new Date().toISOString().split('T')[0];
    const [todayMaintenance] = await query(
      `SELECT COUNT(*) as count FROM machine_maintenance 
       WHERE DATE(scheduled_date) = ? OR DATE(completed_at) = ?`,
      [today, today]
    );
    
    return {
      machine_count: machineCount.count,
      user_count: userCount.count,
      active_breakdowns: activeBreakdowns.count,
      today_maintenance: todayMaintenance.count
    };
  },

  async getCriticalIssues() {
    const sql = `
      SELECT 
        mb.breakdown_id,
        mb.title,
        mb.severity,
        mb.breakdown_start_time,
        m.title as machine_title,
        d.title as division_title,
        bs.name as status_name
      FROM machine_breakdowns mb
      JOIN machines m ON mb.machine_id = m.machine_id
      JOIN divisions d ON m.division_id = d.division_id
      JOIN breakdown_statuses bs ON mb.status_id = bs.status_id
      WHERE mb.severity IN ('critical', 'high') 
        AND mb.breakdown_end_time IS NULL
      ORDER BY 
        CASE mb.severity 
          WHEN 'critical' THEN 1 
          WHEN 'high' THEN 2 
          ELSE 3 
        END,
        mb.breakdown_start_time ASC
      LIMIT 10
    `;
    
    return query(sql);
  },

  async getRecentActivity() {
    const sql = `
      SELECT 
        'breakdown' as type,
        mb.breakdown_id as id,
        mb.title,
        mb.severity,
        mb.created_at,
        m.title as machine_title
      FROM machine_breakdowns mb
      JOIN machines m ON mb.machine_id = m.machine_id
      WHERE mb.created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
      
      UNION ALL
      
      SELECT 
        'maintenance' as type,
        mm.maintenance_id as id,
        mm.title,
        mm.priority as severity,
        mm.completed_at as created_at,
        m.title as machine_title
      FROM machine_maintenance mm
      JOIN machines m ON mm.machine_id = m.machine_id
      WHERE mm.completed_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
      
      ORDER BY created_at DESC
      LIMIT 20
    `;
    
    return query(sql);
  }
};