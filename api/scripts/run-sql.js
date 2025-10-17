import { env } from '../src/config/env.js';
import mysql from 'mysql2/promise';
import fs from 'fs';

(async function main() {
  try {
    const file = process.argv[2];
    if (!file) throw new Error('SQL file path required');
    const sql = fs.readFileSync(file, 'utf8');

    // Guard: phpMyAdmin dumps with DELIMITER/procedures are not supported via mysql2 "multipleStatements".
    // These require the mysql CLI client (DELIMITER is a client-side directive).
    const hasDelimiter = /\bDELIMITER\b/i.test(sql);
    const hasRoutine = /\bCREATE\s+(DEFINER\s*=\s*[^\s]+\s*)?(PROCEDURE|FUNCTION|TRIGGER)\b/i.test(sql);
    if (hasDelimiter || hasRoutine) {
      console.error('\n❌ This SQL file contains DELIMITER/Stored Routines, which cannot be executed via this script.');
      console.error('   Please import it using the mysql CLI instead, e.g.:');
      console.error('     mysql -h 127.0.0.1 -u root machine_cure < path/to/file.sql');
      console.error('\n   Tip: If needed, strip DEFINER and DELIMITER lines before import:');
      console.error("     sed -E 's/DEFINER=`[^`]+`@`[^`]+` //g' file.sql | sed -E '/^DELIMITER /d' | mysql -h 127.0.0.1 -u root machine_cure");
      process.exit(1);
    }
    const connection = await mysql.createConnection({
      host: env.db.host,
      port: env.db.port,
      user: env.db.user,
      password: env.db.password,
      multipleStatements: true
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${env.db.database}\``);
    await connection.changeUser({ database: env.db.database });
    await connection.query(sql);
    console.log('SQL executed for', file);
    await connection.end();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
