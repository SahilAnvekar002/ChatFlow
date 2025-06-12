// import module
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

// convert message to cipher text
export const encryptMessage = (text) => {
  console.log(SECRET_KEY);
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

// convert cipher text to message
export const decryptMessage = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};