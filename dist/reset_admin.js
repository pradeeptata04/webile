"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const User_1 = __importDefault(require("./models/User"));
dotenv_1.default.config();
const resetAdmin = async () => {
    try {
        await (0, db_1.default)();
        const email = 'admin@example.com';
        const password = 'password123';
        let user = await User_1.default.findOne({ email });
        if (user) {
            user.password = password;
            await user.save();
            console.log('Admin password updated');
        }
        else {
            user = await User_1.default.create({
                name: 'Admin User',
                email,
                password,
                role: 'admin'
            });
            console.log('Admin created');
        }
        process.exit();
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
};
resetAdmin();
