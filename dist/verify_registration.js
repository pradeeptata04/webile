"use strict";
const fs = require('fs');
const loginAndRegister = async () => {
    const BASE_URL = 'http://localhost:5000/api/auth';
    // 1. Login as Admin
    console.log('Logging in as Admin...');
    try {
        const loginResponse = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'password123'
            })
        });
        if (!loginResponse.ok) {
            console.error('Login Failed:', loginResponse.status, await loginResponse.text());
            return;
        }
        const adminData = await loginResponse.json();
        console.log('Admin Logged In. Token:', adminData.token ? 'Yes' : 'No');
        const token = adminData.token;
        // 2. Register Manager
        console.log('Registering Manager...');
        const managerData = {
            name: "manager",
            email: "manager@gmail.com",
            password: "Manager@123",
            role: "manager"
        };
        const registerResponse = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(managerData)
        });
        if (!registerResponse.ok) {
            const errorText = await registerResponse.text();
            console.error('Registration Failed:', registerResponse.status);
            fs.writeFileSync('error.html', errorText);
            console.log('Error details saved to error.html');
        }
        else {
            const newManager = await registerResponse.json();
            console.log('Manager Registered Successfully:', newManager);
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
};
loginAndRegister();
