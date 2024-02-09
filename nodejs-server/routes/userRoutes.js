import express from 'express';
import UserController from '../controllers/userController.js';
import {
  registerValidator,
  loginValidator,
} from '../validators/userValidator.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post(
  '/register',
  registerValidator,
  authenticateToken,
  UserController.register
);
router.post('/login', loginValidator, authenticateToken, UserController.login);

export default router;
