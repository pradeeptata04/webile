import express from 'express';
import { loginUser, registerUser } from '../controllers/authController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', protect, authorize('admin', 'manager'), registerUser);

export default router;
