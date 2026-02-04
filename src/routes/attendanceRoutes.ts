import express from 'express';
import { markAttendance, getAttendance, getMyAttendance, getAttendanceStats, getDailyAttendance } from '../controllers/attendanceController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/daily', protect, authorize('manager'), getDailyAttendance);
router.get('/my-history', protect, getMyAttendance);
router.get('/stats', protect, authorize('manager'), getAttendanceStats);
router.post('/', protect, authorize('manager'), markAttendance);
router.get('/:id', protect, getAttendance); // Permissions checked in controller

export default router;
