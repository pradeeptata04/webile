import CryptoJS from 'crypto-js';

const KEY = process.env.ENCRYPTION_KEY || 'default-secret-key-change-this';

export const decryptPayload = (ciphertext: string): any => {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, KEY);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedData);
    } catch (error) {
        console.error('Decryption failed:', error);
        return null;
    }
};

export const encryptResponse = (data: any): string => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), KEY).toString();
};
