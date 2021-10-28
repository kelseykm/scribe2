const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const router = express.Router();
const db = require('../lib/database');
const { aesCfbCipher } = require('../lib/cryptography');

const textNotesDir = path.join(process.env.PWD, 'db', 'text_notes');
const voiceNotesDir = path.join(process.env.PWD, 'db', 'voice_notes');

function ensureLogin(req, res, next) {
  if (!req.session.user) res.redirect('/');
  else next();
}

function saveEntry(req, entryType, filename) {
  switch (entryType) {
    case 'text_note_entry':
      fs.writeFile(
        path.join(textNotesDir, filename),
        aesCfbCipher.encrypt(req.session.user.noteSecurityKey, req.body['text_note_entry']),
        err => { if (err) console.error(err); }
      );
      break;
    case 'voice_note_entry':
      fs.writeFile(
        path.join(voiceNotesDir, filename),
        aesCfbCipher.encrypt(req.session.user.noteSecurityKey, req.body['voice_note_entry']),
        err => { if (err) console.error(err); }
      );
  }
}

router.use(ensureLogin);

router.post('/add', (req, res) => {
  let entryType = req.body['text_note_entry'] !== undefined ? 'text_note_entry' : req.body['voice_note_entry'] !== undefined ? 'voice_note_entry' : null;
  if (!entryType) return res.json({ status: 400, message: 'Failed. All fields must be provided' });

  let filename = crypto.randomUUID();

  db.run(`INSERT INTO notes (user_id, topic_id, entry_name, ${entryType}) VALUES (?, ?, ?, ?)`,
  [ req.session.user.id, req.body['topic_id'], req.body['entry_name'], filename ], err => {
    if (!err) {
      res.json({ status: 201, message: 'Note added' });
      saveEntry(req, entryType, filename);
    }
    else {
      console.error(err);
      if (!req.body?.topic_id) res.json({ status: 400, message: 'Failed. All fields must be provided' });
      else res.json({ status: 500, message: 'Server error. Failed to add note' });
    }
  });
});

router.post('/edit', (req, res) => {
  let entryType = req.body['text_note_entry'] !== undefined ? 'text_note_entry' : req.body['voice_note_entry'] !== undefined ? 'voice_note_entry' : null;
  if (!entryType) return res.json({ status: 400, message: 'Failed. All fields must be provided' });

  db.get('SELECT * FROM notes WHERE user_id = ? AND topic_id = ? AND entry_name = ?',
  [ req.session.user.id, req.body['topic_id'], req.body['former_entry_name'] ], (err, row) => {
    if (err) {
      console.error(err);
      if (!req.body?.topic_id || !req.body?.former_entry_name)
      return res.json({ status: 400, message: 'Failed. All fields must be provided' });
      return res.json({ status: 500, message: 'Server error. Failed to change note' });
    }
    if (row) {
      let filename = row[entryType];
      saveEntry(req, entryType, filename);

      if ( req.body['former_entry_name'] !== req.body['entry_name'] ) {
        db.run('UPDATE notes SET entry_name = ? WHERE user_id = ? AND topic_id = ? AND entry_name = ?',
        [ req.body['entry_name'], req.session.user.id, req.body['topic_id'], req.body['former_entry_name'] ],
        err => {
          if (!err) res.json({ status: 200, message: 'Note changed' });
          else {
            console.error(err);
            if (!req.body?.entry_name || !req.body?.topic_id || !req.body?.former_entry_name)
            res.json({ status: 400, message: 'Failed. All fields must be provided' });
            else res.json({ status: 500, message: 'Server error. Failed to change note' });
          }
        });
      } else res.json({ status: 200, message: 'Note changed' });
    }
    else res.json({ status: 400, message: 'Note does not exist' });
  });
});

router.post('/delete', (req, res) => {
  db.get('SELECT * FROM notes WHERE user_id = ? AND topic_id = ? AND entry_name = ?',
  [ req.session.user.id, req.body['topic_id'], req.body['entry_name'] ], (err, row) => {
    if (err) {
      console.error(err);
      if (!req.body?.topic_id || !req.body?.entry_name)
      return res.json({ status: 400, message: 'Failed. All fields must be provided' });
      return res.json({ status: 500, message: 'Server error. Failed to delete note' });
    }
    if (row) {
      let entryType = row['text_note_entry'] ? 'text_note_entry' : 'voice_note_entry';
      const func = () => {
        db.run('DELETE FROM notes WHERE user_id = ? AND topic_id = ? AND entry_name = ?',
        [ req.session.user.id, req.body['topic_id'], req.body['entry_name'] ], err => {
          if (!err) res.json({ status: 200, message: 'Note deleted' });
          else {
            console.error(err);
            if (!req.body?.topic_id || !req.body?.entry_name)
            res.json({ status: 400, message: 'Failed. All fields must be provided' });
            else res.json({ status: 500, message: 'Server error. Failed to delete note' });
          }
        });
      };
      switch (entryType) {
        case 'text_note_entry':
          fs.rm(
            path.join(textNotesDir, row['text_note_entry']),
            err => {
              if (!err) func();
              else {
                console.error(err);
                res.json({ status: 500, message: 'Server error. Failed to delete note' });
              }
            }
          );
          break;
        case 'voice_note_entry':
          fs.rm(
            path.join(voiceNotesDir, row['voice_note_entry']),
            err => {
              if (!err) func();
              else {
                console.error(err);
                res.json({ status: 500, message: 'Server error. Failed to delete note' });
              }
            }
          );
      }
    } else res.json({ status: 400, message: 'Note does not exist' });
  });
});

module.exports = router;
