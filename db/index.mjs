import pkg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
  override: true,
  path: path.join(__dirname, '../.env'),
});

const { Pool, Client } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export const connectDb = async () => {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT current_user');
    const currentUser = rows[0].current_user;
    console.log(currentUser);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  } finally {
    client.release();
  }
};
