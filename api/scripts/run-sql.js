import { env } from '../src/config/env.js';
import mysql from 'mysql2/promise';
import fs from 'fs';

(async function main() {
  try {
    const file = process.argv[2];
    if (!file) throw new Error('SQL file path required');
    const sql = fs.readFileSync(file, 'utf8');

    // Handle phpMyAdmin dumps that include DELIMITER/DEFINER by stripping routine blocks.
    // Note: We don't need stored routines for CI; removing them is safe for our use.
    let sqlToRun = sql;
    const hasDelimiter = /\bDELIMITER\b/i.test(sqlToRun);
    const hasRoutine = /\bCREATE\s+(DEFINER\s*=\s*[^\s]+\s*)?(PROCEDURE|FUNCTION|TRIGGER)\b/i.test(sqlToRun);
    if (hasDelimiter || hasRoutine) {
      console.warn('\n⚠️  Detected DELIMITER/Stored Routines in SQL. Stripping routine blocks and DEFINER clauses for CI...');
      // Remove DEFINER=... qualifiers
      sqlToRun = sqlToRun.replace(/DEFINER=`[^`]+`@`[^`]+`\s*/gi, '');
      // Remove blocks between DELIMITER ... and the next DELIMITER ... (non-greedy)
      // This aims to drop stored procedures/functions/triggers sections entirely.
      let before;
      do {
        before = sqlToRun;
        sqlToRun = sqlToRun.replace(/\n?DELIMITER\s+[^\n]+[\s\S]*?\nDELIMITER\s+[^\n]+\n?/gi, '\n');
      } while (sqlToRun !== before);
      // Also remove any stray DELIMITER lines
      sqlToRun = sqlToRun.replace(/^DELIMITER\s+.*$/gim, '');
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
    await connection.query(sqlToRun);
    console.log('SQL executed for', file);
    await connection.end();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
