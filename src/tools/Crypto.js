import CryptoJS from 'crypto-js';

const key = CryptoJS.enc.Utf8.parse("wTuQtvphrscRMoNY"); //十六位十六进制数作为秘钥
const iv = CryptoJS.enc.Utf8.parse('yku3fNnI2HJQWKd3'); //十六位十六进制数作为秘钥偏移量

//加密方法
const AesEncrypt = (word) => {
  let encrypted = CryptoJS.AES.encrypt(word, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return encrypted.toString();
};

//解密方法
const AesDecrypt = (word) => {
  let decrypted = CryptoJS.AES.decrypt(word, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  let decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
};

export {
  AesEncrypt,
  AesDecrypt
};