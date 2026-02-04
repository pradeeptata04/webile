const axios = require('axios');
const CryptoJS = require('crypto-js');

const API_URL = 'http://localhost:5000/api';
const KEY = 'default-secret-key-change-this';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ODJlNTkzMWUyNmI3OTMwZDRhYmY3NyIsImlhdCI6MTc3MDIwMTIzMywiZXhwIjoxNzcyNzkzMjMzfQ.zrXn4-HEQtSbAJneg4lt6SvKV7ugiPnA1PF-_1Hfz5Q';

const decrypt = (ciphertext) => {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, KEY);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(originalText);
    } catch (e) {
        return { error: 'Decryption failed', raw: ciphertext };
    }
};

const run = async () => {
    try {
        console.log('Calling /attendance/daily...');
        const res = await axios.get(`${API_URL}/attendance/daily?date=2026-02-04`, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });

        console.log('Status:', res.status);
        console.log('Data:', res.data);

        if (res.data.data) {
            console.log('Decrypted Data:', decrypt(res.data.data));
        }

    } catch (error) {
        if (error.response) {
            console.log('Error Status:', error.response.status);
            console.log('Error Body:', error.response.data);
            if (error.response.data.data) {
                console.log('Decrypted Error:', decrypt(error.response.data.data));
            } else if (typeof error.response.data === 'string') {
                // Maybe the whole body is encrypted?
                console.log('Decrypted Error String:', decrypt(error.response.data));
            }
        } else {
            console.error('Error:', error.message);
        }
    }
};

run();
