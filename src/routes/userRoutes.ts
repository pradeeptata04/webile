import express from 'express';
import { getUsers, updateUserProfile } from '../controllers/userController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, authorize('admin', 'manager'), getUsers);
router.put('/profile', protect, updateUserProfile);

export default router;
