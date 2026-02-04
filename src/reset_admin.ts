import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db';
import User from './models/User';

dotenv.config();

const resetAdmin = async () => {
    try {
        await connectDB();

        const email = 'admin@example.com';
        const password = 'password123';

        let user = await User.findOne({ email });

        if (user) {
            user.password = password;
            await user.save();
            console.log('Admin password updated');
        } else {
            user = await User.create({
                name: 'Admin User',
                email,
                password,
                role: 'admin'
            });
            console.log('Admin created');
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

resetAdmin();
