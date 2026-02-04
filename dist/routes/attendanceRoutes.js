"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const attendanceController_1 = require("../controllers/attendanceController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/daily', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('manager'), attendanceController_1.getDailyAttendance);
router.get('/my-history', authMiddleware_1.protect, attendanceController_1.getMyAttendance);
router.get('/stats', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('manager'), attendanceController_1.getAttendanceStats);
router.post('/', authMiddleware_1.protect, (0, authMiddleware_1.authorize)('manager'), attendanceController_1.markAttendance);
router.get('/:id', authMiddleware_1.protect, attendanceController_1.getAttendance); // Permissions checked in controller
exports.default = router;
