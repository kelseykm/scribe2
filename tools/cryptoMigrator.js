const readline = require('readline');
const db = require('./database');
const { verify, generateNoteSecurityKeyDecryptor, aesCfbCipher } = require('./cryptography');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const oldCipher = {
  ALGO: 'aes-256-cfb',
  IV_LENGTH: 16,
  KEY_LENGTH: 32,
  encrypt: function (key, clearMesg) {
    key = Buffer.from(key, 'hex');
    let iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv(this.ALGO, key, iv);

    let encMesg = cipher.update(clearMesg, 'utf8', 'hex');
    encMesg += cipher.final('hex');

    return iv.toString('hex') + encMesg;
  },
  decrypt: function (key, encMass) {
    key = Buffer.from(key, 'hex');
    let iv = Buffer.from(encMass.substr(0, this.IV_LENGTH * 2), 'hex');
    let encMesg = encMass.substr(this.IV_LENGTH * 2);

    const decipher = crypto.createDecipheriv(this.ALGO, key, iv);

    let decMesg = decipher.update(encMesg, 'hex', 'utf8');
    decMesg += decipher.final('utf8');
    return decMesg;
  }
}

function validateCreds(userCreds) {
  const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

  if (!userCreds.email || !emailRegex.test(userCreds.email)) {
    console.log('\033[1;31mInvalid email\033[0;39m');
    process.exit(1);
  }
  else if (!userCreds.password || !(userCreds.password.length >= 8)) {
    console.log('\033[1;31mPassword is too short\033[0;39m');
    process.exit(1);
  }
}

function authenticateUserAndMigrate(userCreds) {
  db.get('SELECT * FROM users WHERE email = ?', userCreds['email'], async (err, row) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    if (!row) {
      console.log('\033[1;31mNo user with that email exists\033[0;39m');
      process.exit(1);
    }

    if (!(await verify(userCreds['password'], row['password_hash']))) {
      console.log('\033[1;31mWrong password\033[0;39m');
      process.exit(1);
    }

    let noteSecurityKeyDecryptor = await generateNoteSecurityKeyDecryptor(userCreds['password'], row['note_security_salt']);
    let noteSecurityKey = oldCipher.decrypt(noteSecurityKeyDecryptor, row['encrypted_note_security_key']);

    db.all('SELECT * FROM notes WHERE user_id = ?', row['id'], (err, noteRows) => {
      noteRows.map(noteRow => {
        let notePath = noteRow['text_note_entry'] ? path.join(process.env.PWD, 'db', 'text_notes', noteRow['text_note_entry']) : path.join(process.env.PWD, 'db', 'voice_notes', noteRow['voice_note_entry']);

        let decryptedNote = oldCipher.decrypt(
          noteSecurityKey,
          fs.readFileSync(
            notePath
          ).toString()
        );

        let reEncryptedNote = aesCfbCipher.encrypt(
          Buffer.from(noteSecurityKey, 'hex').toString('binary'),
          decryptedNote
        );

        fs.writeFile(
          notePath,
          reEncryptedNote,
          err => {
            if (err) {
              console.log('\033[1;31mMigration of \033[1;39m' + notePath.split('/').reverse()[0] + '\033[1;31m to new cryptography \033[4;31mfailed\033[0;39m');
              console.error(err);
            }
            else console.log('\033[1;32mMigration of \033[1;39m' + notePath.split('/').reverse()[0] + '\033[1;32m to new cryptography \033[4;32msuccessful\033[0;39m');
          }
        );
      });
      console.log('\033[5;31m\033[1;31m\033[4;31mWARNING\033[0;39m\033[1;33m Do not run this script again for the same user after getting success messages! If you do, you \033[4;33mwill\033[0;39m\033[1;33m lose the data in your notes permanently!\033[0;39m');
    });
  });
}

const rL = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rL._writeToOutput = (strToWrite) => {
  if (rL.mutedOutput) rL.output.write('*');
  else rL.output.write(strToWrite);
};

rL.question('\033[1;34m\033[4;34mEmail\033[0;39m\033[1;39m:\033[0;39m ', email => {
  email = email.trim();
  rL.question('\033[1;34m\033[4;34mPassword\033[0;39m\033[1;39m:\033[0;39m ', password => {
    console.log('\n');
    rL.mutedOutput = false;
    rL.close();

    validateCreds({ email, password });
    authenticateUserAndMigrate({ email, password });
  });
  rL.mutedOutput = true;
});
