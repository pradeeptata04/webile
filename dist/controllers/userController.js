"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.getUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
// @desc    Get all users (Admin: all managers/employees, Manager: their employees)
// @route   GET /api/users
// @access  Private (Admin/Manager)
const getUsers = async (req, res) => {
    try {
        const user = req.user;
        let users;
        if (user.role === 'admin') {
            // Admin can see all Managers (and maybe employees too, but mostly managers)
            // Let's return all users for now or filter by query
            users = await User_1.default.find({ role: { $ne: 'admin' } }).select('-password');
        }
        else if (user.role === 'manager') {
            // Manager sees only their employees
            users = await User_1.default.find({ managerId: user._id, role: 'employee' }).select('-password');
        }
        else {
            return res.status(401).json({ message: 'Not authorized' });
        }
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getUsers = getUsers;
// @desc    Update user profile (Password only for now)
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user._id);
        if (user) {
            // If password update requested
            if (req.body.password && req.body.oldPassword) {
                // Check if old password matches
                const isMatch = await user.matchPassword(req.body.oldPassword);
                if (!isMatch) {
                    return res.status(400).json({ message: 'Invalid current password' });
                }
                user.password = req.body.password;
            }
            else if (req.body.password && !req.body.oldPassword) {
                return res.status(400).json({ message: 'Please provide current password' });
            }
            // We can add name update here later if needed
            // user.name = req.body.name || user.name;
            // user.email = req.body.email || user.email;
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                token: req.token // Keep existing token or generate new if needed (usually not needed for just password)
            });
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
exports.updateUserProfile = updateUserProfile;
