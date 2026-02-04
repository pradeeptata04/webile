
const API_URL = 'https://webile-production.up.railway.app/api';

async function testEncryption() {
    try {
        console.log('Testing GET /users...');
        // We need a valid token. Since we can't easily login without encryption (if strict mode is on), 
        // we'll try to login first.

        const CryptoJS = require('crypto-js');
        const KEY = process.env.ENCRYPTION_KEY || 'default-secret-key-change-this';

        const payload = {
            email: 'admin@example.com',
            password: 'password123'
        };
        const encryptedBody = CryptoJS.AES.encrypt(JSON.stringify(payload), KEY).toString();

        try {
            const loginRes = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: encryptedBody })
            });

            if (loginRes.status !== 200) {
                console.log('Login failed:', await loginRes.text());
                return;
            }

            const data = await loginRes.json();
            let token;

            if (data.data && typeof data.data === 'string') {
                console.log('✅ Login response IS encrypted.');
                const bytes = CryptoJS.AES.decrypt(data.data, KEY);
                const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                token = decrypted.token;
            } else {
                console.log('⚠️ Login response IS NOT encrypted (unexpected).');
                token = data.token;
            }

            if (!token) {
                console.log('No token found.');
                return;
            }

            const usersRes = await fetch(`${API_URL}/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const usersData = await usersRes.json();
            if (usersData.data && typeof usersData.data === 'string') {
                console.log('✅ Users response IS encrypted.');
                // Optional: Decrypt to verify content
                const uBytes = CryptoJS.AES.decrypt(usersData.data, KEY);
                const uDecrypted = JSON.parse(uBytes.toString(CryptoJS.enc.Utf8));
                console.log('Decrypted User Count:', uDecrypted.length);
            } else {
                console.log('❌ Users response IS NOT encrypted.');
                console.log('Data Type:', typeof usersData);
                console.log('Sample:', JSON.stringify(usersData).substring(0, 100));
            }

        } catch (e) {
            console.error('Request failed:', e);
        }
    } catch (error) {
        console.error('Test Error:', error);
    }
}

testEncryption();
