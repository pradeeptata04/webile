"use strict";
const API_URL = 'http://localhost:5000/api';
async function testEncryption() {
    try {
        console.log('Testing Login (POST)...');
        try {
            const loginRes = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'admin@example.com',
                    password: 'password123'
                })
            });
            console.log('Login Response Status:', loginRes.status);
            const data = await loginRes.json();
            if (data.data && typeof data.data === 'string') {
                console.log('Login response IS encrypted structure.');
            }
            else {
                console.log('Login response IS NOT encrypted structure.');
                console.log('Data sample:', JSON.stringify(data).substring(0, 100));
            }
            // Test GET /users (requires auth usually, but let's see)
            // If auth is required, we need the token (but we might not get it if encryption is broken/plaintext mismatch)
            // Assuming we got plaintext token or successfully decrypted if working:
        }
        catch (e) {
            console.log('Login failed:', e);
        }
    }
    catch (error) {
        console.error('Test Error:', error);
    }
}
testEncryption();
