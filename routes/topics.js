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
router.use('/notes', require('./notes'));

router.post('/add', (req, res) => {
  db.run(`INSERT INTO topics (
    user_id,
    subject_name,
    section_name,
    topic_name,
    topic_id
  ) VALUES (?, ?, ?, ?, ?)`,
  [
    req.session.user.id,
    req.body['subject_name'],
    req.body['section_name'],
    req.body['topic_name'],
    req.body['topic_id']
  ], err => {
    if (!err) res.json({ status: 201, message: 'Topic added' });
    else {
      if (err.code === 'SQLITE_CONSTRAINT')
      res.json({ status: 400, message: 'Failed. Topic already exists in this section' });
      else {
        console.error(err);
        if (!req.body?.subject_name || !req.body?.section_name || !req.body?.topic_name || !req.body?.topic_id)
        res.json({ status: 400, message: 'Failed. All fields must be provided' });
        else res.json({ status: 500, message: 'Server error. Failed to add topic' });
      }
    }
  });
});

router.post('/edit', (req, res) => {
  db.run('UPDATE topics SET topic_name = ? WHERE user_id = ? AND topic_name = ? AND topic_id = ?',
  [
    req.body['topic_name'],
    req.session.user.id,
    req.body['former_topic_name'],
    req.body['topic_id']
  ], err => {
    if (!err) res.json({ status: 200, message: 'Topic changed' });
    else {
      if (err.code === 'SQLITE_CONSTRAINT')
      res.json({ status: 400, message: 'Failed. Topic already exists in this section' });
      else {
        console.error(err);
        if (!req.body?.topic_name || !req.body?.former_topic_name || !req.body?.topic_id)
        res.json({ status: 400, message: 'Failed. All fields must be provided' });
        else res.json({ status: 500, message: 'Server error. Failed to change topic' });
      }
    }
  });
});

router.post('/delete', (req, res) => {
  db.all('SELECT * FROM notes WHERE user_id = ? and topic_id = ?',
  [ req.session.user.id, req.body['topic_id'] ], (err, noteRows) => {
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

      db.run('DELETE FROM topics WHERE user_id = ? AND topic_id = ?',
      [ req.session.user.id, req.body['topic_id'] ], err => {
        if (!err) res.json({ status: 200, message: 'Topic deleted' });
        else {
          console.error(err);
          if (!req.body?.topic_id) res.json({ status: 400, message: 'Failed. All fields must be provided' });
          else res.json({ status: 500, message: 'Server error. Failed to delete topic' });
        }
      });
    }
    else {
      console.error(err);
      if (!req.body?.topic_id) res.json({ status: 400, message: 'Failed. All fields must be provided' });
      else res.json({ status: 500, message: 'Server error. Failed to delete topic' });
    }
  });
});

router.get('/:topic', (req, res) => {
  db.get('SELECT * FROM topics WHERE user_id = ? AND topic_id = ?',
  [ req.session.user.id, req.query.id ], (err, topicRow) => {
    if (!err) {
      if (topicRow) {
        db.all('SELECT * FROM notes WHERE user_id = ? AND topic_id = ? ORDER BY creation_time',
        [ req.session.user.id, req.query.id ], (err, noteRows) => {
          if (!err) {
            let topic = topicRow;
            for (let note of noteRows) note['note_security_key'] = req.session.user.noteSecurityKey;
            topic.notes = noteRows;
            res.render('topic', {
              my: {
                title: 'Scribe - ' + topic['topic_name'],
                topic: topic,
                showBread: true,
                username: req.session.user.username,
              }
            });
          } else {
            console.error(err);
            return res.status(500).send();
          }
        });
      } else res.status(404).render('notFound', {
        my: {
          nav: true,
          title: 'Scribe - 404',
          topic: true,
          showBread: true,
          username: req.session.user.username,
        }
      });
    } else {
      console.error(err);
      return res.status(500).send();
    }
  });
});

module.exports = router;
