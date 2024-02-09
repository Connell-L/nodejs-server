import { connectDb } from '../config/db.mjs';
import bcrypt from 'bcryptjs';

export class User {
  static async getUserByEmail(email) {
    const client = await connectDb();
    try {
      const { rows } = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      return rows[0];
    } catch (error) {
      console.error(error.message);
    } finally {
      client.release();
    }
  }

  static async createUser(email, password) {
    const client = await connectDb();
    try {
      const { rows } = await client.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING user_id',
        [email, password]
      );
      return rows[0].user_id;
    } catch (error) {
      console.error(error.message);
    } finally {
      client.release();
    }
  }
}
