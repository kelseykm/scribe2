const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('../database');
const { hash, verify, generateNoteSecurityKeyDecryptor, aesCfbCipher } = require('../cryptography');

const router = express.Router();

function ensureLogin(req, res, next) {
  if (!req.session.user) res.redirect('/');
  else next();
}

router.use([
  '/log-out',
  '/change-username',
  '/change-password',
  '/delete-account'
], ensureLogin);

router.get('/log-in', (req, res) => {
  res.render('login', {
    my: {
      login: true,
      showBread: false,
      title: 'Scribe - Log In'
    },
    layout: 'auth'
  });
});

router.post('/log-in', (req, res) => {
  db.get('SELECT * FROM users WHERE email = ?', req.body['email'],
  async (err, row) => {
    if (err) return res.json({ status: 500, message: 'Login failed. Server error' });
    else if (!row) return res.json({ status: 400, message: 'No user with that email exists' });

    try {
      let authorized = await verify(req.body['password'], row['password_hash']);
      if (!authorized) return res.json({ status: 401, message: 'Wrong password' });

      let noteSecurityKeyDecryptor = await generateNoteSecurityKeyDecryptor(req.body['password'], row['note_security_salt']);
      let noteSecurityKey = aesCfbCipher.decryptKey(noteSecurityKeyDecryptor, row['encrypted_note_security_key']);
      noteSecurityKey = Buffer.from(noteSecurityKey, 'hex').toString('binary');

      req.session.user = {
        username: row['username'],
        id: row['id'],
        noteSecurityKey
      };
      res.json({ status: 200, message: 'Logged in'})

    } catch (e) {
      console.error(e);
      res.json({ status: 500, message: 'Login failed. Server error' });
    }
  });
});

router.get('/sign-up', (req, res) => {
  res.render('signup', {
    my: {
      login: false,
      showBread: false,
      title: 'Scribe - Sign Up'
    },
    layout: 'auth'
  });
});

router.post('/sign-up', (req, res) => {
  db.get('SELECT email FROM users WHERE email = ?', req.body['email'],
  async (err, emailRow) => {
    if (err) return res.json({ status: 500, message: 'Sign up failed. Server error' });
    if (emailRow) return res.json({ status: 400, message: 'A user with that email already exists' });

    try {

      let noteSecuritySalt = crypto.randomBytes(32).toString('hex');
      let noteSecurityKeyDecryptor = await generateNoteSecurityKeyDecryptor(req.body['password'], noteSecuritySalt);
      let noteSecurityKey = crypto.randomBytes(32).toString('hex');
      let encryptedNoteSecurityKey = aesCfbCipher.encryptKey(noteSecurityKeyDecryptor, noteSecurityKey);

      let hashedPassword = await hash(req.body['password']);

      db.run(`INSERT INTO users (
        username,
        email,
        password_hash,
        note_security_salt,
        encrypted_note_security_key
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        req.body['username'],
        req.body['email'],
        hashedPassword,
        noteSecuritySalt,
        encryptedNoteSecurityKey
      ], err1 => {
        if (!err1) {
          db.get('SELECT * FROM users WHERE email = ?', req.body['email'] , async (err2, row) => {
            if (!err2) {
              req.session.user = {
                username: row['username'],
                id: row['id'],
                noteSecurityKey: Buffer.from(noteSecurityKey, 'hex').toString('binary')
              };
              res.json({ status: 200, message: 'Signed up' });
            }
            else {
              console.error(err2);
              res.json({ status: 500, message: 'Sign up failed. Server error' });
            }
          });
        }
        else {
          console.error(err1);
          res.json({ status: 500, message: 'Sign up failed. Server error' });
        }
      });
    } catch (e) {
      console.error(e);
      res.json({ status: 500, message: 'Sign up failed. Server error' });
    }
  });
});

router.get('/log-out', (req, res) => {
  req.session.destroy(err => {
    if (!err) res.json({ status: 200, message: 'Logged out' });
    else {
      console.error(err);
      res.json({ status: 500, message: 'Server error. Failed to log user out of account' });
    }
  });
});

router.post('/change-username', (req, res) => {
  db.run('UPDATE users SET username = ? WHERE id = ?',
  [ req.body['username'], req.session.user.id ], err => {
    if (!err) {
      req.session.user.username = req.body['username'];
      res.json({ status: 200, message: 'Username changed' });
    }
    else {
      console.error(err);
      res.json({ status: 400, message: 'Failed to change username. All fields must be provided' });
    }
  });
});

router.post('/change-password', (req, res) => {
  if (req.body['new_password'].length < 8 ) {
    return res.json({ status: 400, message: 'Password too short' });
  }

  db.get('SELECT * FROM users WHERE id = ?', req.session.user.id, async (err, row) => {
    if (!err) {
      try {
        let authorized = await verify(req.body['current_password'], row['password_hash']);
        if (!authorized)
        res.json({ status: 401, message: 'Wrong current password. Operation not authorized' });
        else {
          let noteSecuritySalt = crypto.randomBytes(32).toString('hex');
          let noteSecurityKeyDecryptor = await generateNoteSecurityKeyDecryptor(req.body['new_password'], noteSecuritySalt);
          let encryptedNoteSecurityKey = aesCfbCipher.encryptKey(noteSecurityKeyDecryptor, req.session.user.noteSecurityKey);

          let hashedPassword = await hash(req.body['new_password']);

          db.run('UPDATE users SET password_hash = ?, note_security_salt = ?, encrypted_note_security_key = ? WHERE id = ?',
          [ hashedPassword, noteSecuritySalt, encryptedNoteSecurityKey, req.session.user.id ], err => {
            if (!err) res.json({ status: 200, message: 'Password changed' });
            else {
              console.error(err)
              res.json({ status: 500, message: 'Server error. Try again later' });
            }
          });
        }
      } catch (e) {
        console.error(e);
        res.json({ status: 500, message: 'Server error. Try again later' });
      }
    } else {
      console.error(err);
      res.json({ status: 500, message: 'Server error. Try again later' });
    }
  });
});

router.get('/delete-account', (req, res) => {
  db.all('SELECT * FROM notes WHERE user_id = ?', req.session.user.id, (err, noteRows) => {
    if (!err) {
      const textNotesDir = path.join(process.env.PWD, 'db', 'text_notes');
      const voiceNotesDir = path.join(process.env.PWD, 'db', 'voice_notes');

      for (let row of noteRows) {
        let entryType = row['text_note_entry'] ? 'text_note_entry' : 'voice_note_entry';
        switch (entryType) {
          case 'text_note_entry':
            fs.rm(path.join(textNotesDir, row['text_note_entry']), err => {
              if (err) console.error(err)
            });
            break;
          case 'voice_note_entry':
            fs.rm(path.join(voiceNotesDir, row['voice_note_entry']), err => {
              if (err) console.error(err)
            });
        }
      }

      db.run('DELETE FROM users WHERE id = ?', req.session.user.id, err => {
        if (!err) {
          req.session.destroy(err => {
            if (!err) res.json({ status: 200, message: 'Account deleted' });
            else {
              console.error(err);
              res.json({ status: 500, message: 'Server error. Failed to delete account' });
            }
          });
        }
        else {
          console.error(err);
          res.json({ status: 500, message: 'Server error. Failed to delete account' });
        }
      });
    }
    else {
      console.error(err);
      res.json({ status: 500, message: 'Server error. Failed to delete account' });
    }
  });
});

module.exports = router;
