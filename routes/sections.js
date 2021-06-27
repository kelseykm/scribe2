const express = require('express');
const db = require('../database');
const path = require('path');
const fs = require('fs');

const router = express.Router();

function ensureLogin(req, res, next) {
  if (!req.session.user) res.redirect('/');
  else next();
}

router.use(ensureLogin);
router.use('/topics', require('./topics'));

router.post('/add', (req, res) =>{
  db.run('INSERT INTO sections (user_id, subject_name, section_name) VALUES (?, ?, ?)',
  [ req.session.user.id, req.body['subject_name'], req.body['section_name'] ], err => {
    if (!err) res.json({ status: 201, message: 'Section added' });
    else {
      if (err.code === 'SQLITE_CONSTRAINT')
      res.json({ status: 400, message: 'Section already exists' });
      else {
        if (!req.body?.section_name || !req.body?.subject_name)
        res.json({ status: 400, message: 'Failed. All fields must be provided' });
        else res.json({ status: 500, message: 'Server error. Failed to add section' });
      }
    }
  });
});

router.post('/edit', (req, res) => {
  db.run('UPDATE sections SET section_name = ? WHERE section_name = ? AND subject_name = ? AND user_id = ?',
  [
    req.body['section_name'],
    req.body['former_section_name'],
    req.body['subject_name'],
    req.session.user.id
  ], err => {
    if (!err) res.json({ status: 200, message: 'Section changed' });
    else {
      if (err.code === 'SQLITE_CONSTRAINT')
      res.json({ status: 400, message: 'Section already exists' });
      else {
        console.error(err);
        if (!req.body?.section_name || !req.body?.former_section_name || !req.body?.subject_name)
        res.json({ status: 400, message: 'Failed. All fields must be provided' });
        else res.json({ status: 500, message: 'Server error. Failed to change section' });
      }
    }
  });
});

router.post('/delete', (req, res) => {
  db.all('SELECT topic_id FROM topics WHERE section_name = ? AND subject_name = ? AND user_id = ?',
  [ req.body['section_name'], req.body['subject_name'], req.session.user.id ], (err, topicIdRows) => {
    if (err) {
      console.error(err);
      if (!req.body?.section_name || !req.body?.subject_name)
      return res.json({ status: 400, message: 'Failed. All fields must be provided' });
      return res.json({ status: 500, message: 'Server error. Failed to delete section' });
    }

    db.serialize(() => {
      for (let topidIdRow of topicIdRows) {
        db.all('SELECT * FROM notes WHERE user_id = ? AND topic_id = ?',
        [ req.session.user.id, topidIdRow['topic_id'] ], (err, noteRows) => {
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
          }
          else console.error(err);
        });
      }

      db.run('DELETE FROM sections WHERE section_name = ? AND subject_name = ? AND user_id = ?',
      [ req.body['section_name'], req.body['subject_name'], req.session.user.id ], err => {
        if (!err) res.json({ status: 200, message: 'Section deleted' });
        else {
          console.error(err);
          if (!req.body?.section_name || !req.body?.subject_name)
          res.json({ status: 400, message: 'Failed. All fields must be provided' });
          else res.json({ status: 500, message: 'Server error. Failed to delete section' });
        }
      });
    });
  });
});

module.exports = router;
