import { query } from '../config/db.config.js';

export function activityLogger(requiredPermissionName) {
  return async (req, res, next) => {
    res.on('finish', async () => {
      try {
        if (!req.user?.user_id) return;
        // Resolve permission id by name
        const perms = await query('SELECT permission_id FROM permissions WHERE name = ? LIMIT 1', [requiredPermissionName]);
        const permission_id = perms[0]?.permission_id || null;
        await query(
          'INSERT INTO activities (user_id, permission_id, method, path, status_code, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
          [req.user.user_id, permission_id, req.method, req.originalUrl, res.statusCode]
        );
      } catch (_) {
        // swallow activity errors
      }
    });
    next();
  };
}
