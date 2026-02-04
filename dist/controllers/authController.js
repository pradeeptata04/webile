"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = exports.loginUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
// import { decryptPayload, encryptResponse } from '../utils/encryption'; // No longer needed manually
const loginUser = async (req, res) => {
    try {
        // Middleware has already decrypted req.body
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            // Middleware will automatically encrypt this response
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                managerId: user.managerId,
                token: (0, generateToken_1.default)(user._id),
            });
        }
        else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Server error during login' });
    }
};
exports.loginUser = loginUser;
// @desc    Register a new user (Admin creates Manager, Manager creates Employee)
// @route   POST /api/auth/register
// @access  Private (Admin/Manager)
const registerUser = async (req, res) => {
    // Note: This endpoint is for Admins to create Managers, or Managers to create Employees.
    // Basic registration logic here, will detailed role checks in routes.
    const { name, email, password, role, managerId } = req.body;
    const userExists = await User_1.default.findOne({ email });
    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }
    const user = await User_1.default.create({
        name,
        email,
        password,
        role,
        managerId
    });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: (0, generateToken_1.default)(user._id),
        });
    }
    else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};
exports.registerUser = registerUser;
