const CryptoJS = require('crypto-js');
const KEY = 'default-secret-key-change-this';
const ciphertext = 'U2FsdGVkX198w98gmU4IXS/0uU0S5kt6zy4xFDNgnSa2bu2SElQqxq2aHY82JvKXQBuohvqLUeV+VBFxBT/ej7ApTGZ/cOUFmNYUuBNP5y/YsP5Hb1C+6OIFQTIvfetKWnPrpGoTI9wdTPIU2dqBFA==';

try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    console.log('Decrypted:', originalText);
} catch (e) {
    console.error('Decryption error:', e);
}