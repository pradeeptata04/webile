"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptResponse = exports.decryptPayload = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const KEY = process.env.ENCRYPTION_KEY || 'default-secret-key-change-this';
const decryptPayload = (ciphertext) => {
    try {
        const bytes = crypto_js_1.default.AES.decrypt(ciphertext, KEY);
        const decryptedData = bytes.toString(crypto_js_1.default.enc.Utf8);
        return JSON.parse(decryptedData);
    }
    catch (error) {
        console.error('Decryption failed:', error);
        return null;
    }
};
exports.decryptPayload = decryptPayload;
const encryptResponse = (data) => {
    return crypto_js_1.default.AES.encrypt(JSON.stringify(data), KEY).toString();
};
exports.encryptResponse = encryptResponse;
