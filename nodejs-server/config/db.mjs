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

const { Pool } = pkg;

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

async function createAuthenticationTable() {
  try {
    // Check if the authentication table already exists
    const tableCheckQuery = `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'authentication'
      );
    `;
    const { rows } = await pool.query(tableCheckQuery);
    const tableExists = rows[0].exists;

    if (!tableExists) {
      // Create the authentication table
      const createTableQuery = `
        CREATE TABLE authentication (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL
        );
      `;
      await pool.query(createTableQuery);
      console.log('Authentication table created successfully.');
    } else {
      console.log('Authentication table already exists.');
    }
  } catch (error) {
    console.error('Error creating authentication table:', error);
  }
}

// Call the function to create the authentication table
createAuthenticationTable();
