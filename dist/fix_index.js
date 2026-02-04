"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const User_1 = __importDefault(require("./models/User"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const fixIndexes = async () => {
    try {
        await (0, db_1.default)();
        console.log('Connected to DB');
        const indexes = await User_1.default.collection.indexes();
        console.log('Indexes fetched');
        fs_1.default.writeFileSync('indexes.log', JSON.stringify(indexes, null, 2));
        console.log('Indexes written to indexes.log');
        const usernameIndex = indexes.find(idx => idx.name === 'username_1');
        if (usernameIndex) {
            console.log('Found "username_1". Dropping...');
            await User_1.default.collection.dropIndex('username_1');
            console.log('Drop command sent.');
            // Re-fetch to confirm
            const newIndexes = await User_1.default.collection.indexes();
            fs_1.default.writeFileSync('indexes_after.log', JSON.stringify(newIndexes, null, 2));
        }
        else {
            console.log('"username_1" NOT found in list.');
        }
        process.exit();
    }
    catch (error) {
        console.error('Error:', error);
        fs_1.default.writeFileSync('fix_error.log', JSON.stringify(error, null, 2));
        process.exit(1);
    }
};
fixIndexes();
