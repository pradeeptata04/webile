import { Request, Response, NextFunction } from 'express';
import { decryptPayload, encryptResponse } from '../utils/encryption';

// Extend Express Request interface if needed, or just use 'any' for body manipulation
// but keeping it clean with type assertion where possible.

export const globalDecryption = (req: Request, res: Response, next: NextFunction) => {
    // Strict Mode: ALL state-changing methods MUST be encrypted
    // GET requests usually have data in query params, which we assume are NOT encrypted for now (unless we encrypt the whole URL?)
    // User said "all routes". usually payload encryption applies to body.
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        if (!req.body.data) {
            // If we want to serve a helpful error OR support legacy plaintext (during migration), we can check.
            // But the user said "everything must be encrypted". So REJECT plaintext.
            res.status(400).json({ message: 'Encrypted payload required' });
            return;
        }

        try {
            const decrypted = decryptPayload(req.body.data);
            if (decrypted) {
                req.body = decrypted; // Replace body with decrypted data
            } else {
                res.status(400).json({ message: 'Invalid encrypted payload (decryption failed)' });
                return;
            }
        } catch (error) {
            console.error('Decryption Middleware Error:', error);
            res.status(400).json({ message: 'Decryption processing failed' });
            return;
        }
    }
    next();
};

export const globalEncryption = (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json;

    // Override res.json to auto-encrypt
    res.json = function (data: any): Response {
        // console.log('Global Encryption Middleware hit for:', req.originalUrl);

        // Check if data is already encrypted structure (to avoid double encryption)
        if (data && data.data && typeof data.data === 'string' && Object.keys(data).length === 1) {
            return originalJson.call(this, data);
        }

        try {
            const encrypted = encryptResponse(data);
            // Ensure we match the { data: ciphertext } format
            return originalJson.call(this, { data: encrypted });
        } catch (error) {
            console.error('Encryption Middleware Error:', error);
            // In strict mode, maybe we shouldn't return plaintext even on error?
            // But for now, returning a safe error message is better.
            return originalJson.call(this, { message: 'Server Encryption Error' });
        }
    };

    next();
};
