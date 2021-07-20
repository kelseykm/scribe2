const crypto = require('crypto');
const { scrypt } = crypto;
const fs = require('fs');

const KEY_LENGTH = 32;

function hash(password) {
  password = Buffer.from(password);
  let salt = crypto.randomBytes(KEY_LENGTH);

  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, (err, hash) => {
      if (err) reject(err);
      if (hash) {
        hash = hash.toString('hex');
        salt = salt.toString('hex');
        let hashSalt = [ hash, salt ].join(':');
        resolve(hashSalt);
      }
    });
  });
}

function verify(password, hashSalt) {
  password = Buffer.from(password);
  let [submittedHash, salt] = hashSalt.split(':');
  submittedHash = Buffer.from(submittedHash, 'hex');
  salt = Buffer.from(salt, 'hex');

  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, (err, derivedHash) => {
      if (err) reject(err);
      if (derivedHash) resolve(crypto.timingSafeEqual(submittedHash, derivedHash));
    });
  });
}

function generateNoteSecurityKeyDecryptor(password, salt) {
  password = Buffer.from(password);
  salt = Buffer.from(salt);

  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, (err, hash) => {
      if (err) reject(err);
      if (hash) resolve(hash.toString('hex'));
    });
  });
}

const aesCfbCipher = {
  ALGO: 'aes-256-cfb',
  IV_LENGTH: 16,
  KEY_LENGTH,
  encryptKey: function (key, clearMesg) {
    key = Buffer.from(key, 'hex');
    let iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv(this.ALGO, key, iv);

    let encMesg = cipher.update(clearMesg, 'utf8', 'hex');
    encMesg += cipher.final('hex');

    return iv.toString('hex') + encMesg;
  },
  decryptKey: function (key, encMass) {
    key = Buffer.from(key, 'hex');
    let iv = Buffer.from(encMass.substr(0, this.IV_LENGTH * 2), 'hex');
    let encMesg = encMass.substr(this.IV_LENGTH * 2);

    const decipher = crypto.createDecipheriv(this.ALGO, key, iv);

    let decMesg = decipher.update(encMesg, 'hex', 'utf8');
    decMesg += decipher.final('utf8');
    return decMesg;
  },
  encrypt: function (key, clearMesg) {
    key = Buffer.from(key, 'binary');
    clearMesg = Buffer.from(clearMesg, 'binary');

    let iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv(this.ALGO, key, iv);

    let encMesgChunks = [];
    encMesgChunks.push(iv.toString('binary'));
    encMesgChunks.push(cipher.update(clearMesg, 'binary', 'binary'));
    encMesgChunks.push(cipher.final('binary'));

    return encMesgChunks.join('');
  },
  decrypt: function (key, encMass) {
    key = Buffer.from(key, 'binary');
    encMass = Buffer.from(encMass, 'binary');

    let iv = Buffer.from(encMass.slice(0, this.IV_LENGTH), 'binary');
    let encMesg = encMass.slice(this.IV_LENGTH);

    const decipher = crypto.createDecipheriv(this.ALGO, key, iv);

    let decMesgChunks = [];
    decMesgChunks.push(decipher.update(encMesg, 'binary', 'binary'));
    decMesgChunks.push(decipher.final('binary'));
    return decMesgChunks.join('');
  }
}

module.exports = { hash, verify, generateNoteSecurityKeyDecryptor, aesCfbCipher };
