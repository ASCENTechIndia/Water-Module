const CryptoJS = require("crypto-js");

const EncryptionKey = "AS23N7E2H4V717DEAS23N7E2H4V717DE";

// Encrypt password using TripleDES
const encryptPassword = (password) => {
    try {
        console.log("encryptPassword function is called with:", password); // Debugging
        const key = CryptoJS.enc.Utf8.parse(EncryptionKey);
        const encrypted = CryptoJS.TripleDES.encrypt(password, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });

        return encrypted.toString();
    } catch (error) {
        console.error("Encryption error:", error);
        return null;
    }
};

// Decrypt password using TripleDES
const decryptPassword = (encryptedPassword) => {
    try {
        if (!encryptedPassword) return encryptedPassword;
        const key = CryptoJS.enc.Utf8.parse(EncryptionKey);
        const decrypted = CryptoJS.TripleDES.decrypt(encryptedPassword, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
        return decryptedStr || encryptedPassword;
    } catch (error) {
        return encryptedPassword;
    }
};

module.exports = {
    encryptPassword,
    decryptPassword,
};
