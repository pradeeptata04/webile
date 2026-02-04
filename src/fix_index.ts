
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db';
import User from './models/User';
import fs from 'fs';

dotenv.config();

const fixIndexes = async () => {
    try {
        await connectDB();
        console.log('Connected to DB');

        const indexes = await User.collection.indexes();
        console.log('Indexes fetched');

        fs.writeFileSync('indexes.log', JSON.stringify(indexes, null, 2));
        console.log('Indexes written to indexes.log');

        const usernameIndex = indexes.find(idx => idx.name === 'username_1');
        if (usernameIndex) {
            console.log('Found "username_1". Dropping...');
            await User.collection.dropIndex('username_1');
            console.log('Drop command sent.');

            // Re-fetch to confirm
            const newIndexes = await User.collection.indexes();
            fs.writeFileSync('indexes_after.log', JSON.stringify(newIndexes, null, 2));
        } else {
            console.log('"username_1" NOT found in list.');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        fs.writeFileSync('fix_error.log', JSON.stringify(error, null, 2));
        process.exit(1);
    }
};

fixIndexes();
