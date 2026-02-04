import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from './config/db';

console.log('!!! DEBUG: STARTING SERVER FROM SRC/INDEX.TS !!!');
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
