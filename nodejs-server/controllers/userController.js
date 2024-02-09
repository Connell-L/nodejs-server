import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { validationResult } from 'express-validator';

export default class UserController {
  static async register(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const userId = await User.createUser(email, hashedPassword);

      // Success response
      res.status(201).json({ message: 'User created successfully', userId });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async login(req, res) {
    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Fetch user from DB
      const user = await User.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Create JWT
      const accessToken = jwt.sign(
        { userId: user.id },
        process.env.SECRET_KEY,
        {
          expiresIn: '15m',
        }
      );

      // Generate refresh token and save to DB
      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.SECRET_KEY,
        {
          expiresIn: '7d',
        }
      );

      // Return tokens
      res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server error' });
    }
  }
}
