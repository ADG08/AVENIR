import fs from 'fs';
import path from 'path';
import { pool } from './connection';

// In dev: __dirname = back/infrastructure/database/postgres
// In prod (compiled): __dirname = back/dist/infrastructure/database/postgres
// SQL files are always at back/infrastructure/database/postgres, so we walk up from dist if needed
const DB_DIR = __dirname.includes(`${path.sep}dist${path.sep}`)
    ? path.resolve(__dirname, '../../../../infrastructure/database/postgres')
    : path.resolve(__dirname);

async function runSqlDir(client: any, dir: string, table: string): Promise<void> {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort();
    for (const file of files) {
        const { rows } = await client.query(`SELECT 1 FROM ${table} WHERE name = $1`, [file]);
        if (rows.length > 0) continue;
        const sql = fs.readFileSync(path.join(dir, file), 'utf8');
        await client.query('BEGIN');
        await client.query(sql);
        await client.query(`INSERT INTO ${table} (name) VALUES ($1)`, [file]);
        await client.query('COMMIT');
    }
}

export async function runMigrations(): Promise<void> {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS _migrations (
                name VARCHAR(255) PRIMARY KEY,
                applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await client.query(`
            CREATE TABLE IF NOT EXISTS _fixtures (
                name VARCHAR(255) PRIMARY KEY,
                applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        const initSql = fs.readFileSync(path.join(DB_DIR, 'init.sql'), 'utf8');
        await client.query(initSql);

        await runSqlDir(client, path.join(DB_DIR, 'migrations'), '_migrations');
        await runSqlDir(client, path.join(DB_DIR, 'fixtures'), '_fixtures');
    } catch (err) {
        await client.query('ROLLBACK').catch(() => {});
        throw err;
    } finally {
        client.release();
    }
}
