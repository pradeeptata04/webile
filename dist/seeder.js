"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const User_1 = __importDefault(require("./models/User"));
dotenv_1.default.config();
const importData = async () => {
    try {
        await (0, db_1.default)();
        const adminExists = await User_1.default.findOne({ email: 'admin@example.com' });
        if (adminExists) {
            console.log('Admin already exists');
            process.exit();
        }
        await User_1.default.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin'
        });
        console.log('Admin User Created');
        process.exit();
    }
    catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};
importData();
