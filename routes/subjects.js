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
router.use('/sections', require('./sections'));

router.post('/add', (req, res) => {
  db.run('INSERT INTO subjects (user_id, subject_name) VALUES (?, ?)',
  [ req.session.user.id, req.body['subject_name'] ], err => {
    if (!err) res.json({ status: 201, message: 'Subject added' });
    else {
      if (err.code === 'SQLITE_CONSTRAINT')
      res.json({ status: 400, message: 'Subject already exists' });
      else {
        console.error(err);
        if (!req.body?.subject_name) res.json({ status: 400, message: 'Failed. All fields must be provided' });
        else res.json({ status: 500, message: 'Server error. Failed to add subject' });
      }
    }
  });
});

router.post('/edit', (req, res) => {
  db.run('UPDATE subjects SET subject_name = ? WHERE subject_name = ? AND user_id = ?',
  [ req.body['subject_name'], req.body['former_subject_name'], req.session.user.id ],
  err => {
    if (!err) res.json({ status: 200, message: 'Subject changed' });
    else {
      if (err.code === 'SQLITE_CONSTRAINT')
      res.json({ status: 400, message: 'Subject already exists' });
      else {
        console.error(err);
        if (!req.body?.subject_name || !req.body?.former_subject_name)
        res.json({ status: 400, message: 'Failed. All fields must be provided' });
        else res.json({ status: 500, message: 'Server error. Failed to change subject' });
      }
    }
  });
});

router.post('/delete', (req, res) => {
  db.all('SELECT topic_id FROM topics WHERE user_id = ? AND subject_name = ?',
  [ req.session.user.id, req.body['subject_name'] ], (err, topicIdRows) => {
    if (err) {
      console.error(err);
      if (!req.body?.subject_name)
      return res.json({ status: 400, message: 'Failed. All fields must be provided' });
      return res.json({ status: 500, message: 'Failed to delete subject' });
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
          } else console.error(err);
        });
      }

      db.run('DELETE FROM subjects WHERE subject_name = ? AND user_id = ?',
      [ req.body['subject_name'], req.session.user.id ], err => {
        if (!err) res.json({ status: 200, message: 'Subject deleted' });
        else {
          console.error(err);
          if (!req.body?.subject_name)
          res.json({ status: 400, message: 'Failed. All fields must be provided' });
          else res.json({ status: 500, message: 'Server error. Failed to delete subject' });
        }
      });
    });
  });
});

router.get('/', (req, res) => {
  db.all('SELECT subject_name FROM subjects WHERE user_id = ? ORDER BY creation_time',
  req.session.user.id, (err, subjectRows) => {
    if (err) {
      console.error(err);
      return res.status(500).send();
    }

    const util = {
      subjects: subjectRows,
      addSection: function(subjectOfSectionToAdd, sectionToAdd) {
        subject = this.subjects.filter(
          subject => subject['subject_name'] === subjectOfSectionToAdd
        ).pop();
        subject.sections.push(sectionToAdd);
      },
      totalSubjects: subjectRows.length,
      subjectCount: 0,
      totalSections: 0,
      sectionCount: 0,
    }

    if (util.totalSubjects === 0) {
      res.render('home', {
        my: {
          subjects: util.subjects,
          showBread: true,
          title: 'Scribe - Subjects',
          username: req.session.user.username,
        }
      });
      return;
    }

    db.all('SELECT section_name FROM sections WHERE user_id = ?', req.session.user.id,
    (err, rows) => {
      if (!err) {
        util.totalSections = rows.length;
        if (util.totalSections === 0) {
          res.render('home', {
            my: {
              subjects: util.subjects,
              showBread: true,
              title: 'Scribe - Subjects',
              username: req.session.user.username,
            }
          });
        }
      } else {
        console.error(err);
        return res.status(500).send();
      }
    });

    for (let subject of util.subjects) {
      db.all('SELECT section_name FROM sections WHERE user_id = ? AND subject_name = ? ORDER BY creation_time',
      [ req.session.user.id, subject['subject_name'] ], (err, sectionRows) => {
        if (!err) {
          util.subjectCount += 1;
          subject.sections = [];

          for (let sectionRow of sectionRows) {
            db.all('SELECT topic_name, topic_id FROM topics WHERE user_id = ? AND subject_name = ? AND section_name = ? ORDER BY creation_time',
            [ req.session.user.id, subject['subject_name'], sectionRow['section_name'] ],
            (err, topicRows) => {
              if (!err) {
                util.sectionCount += 1;
                let section = sectionRow;
                section.topics = topicRows;
                util.addSection(subject['subject_name'], section);

                if (util.sectionCount === util.totalSections) {
                  res.render('home', {
                    my: {
                      subjects: util.subjects,
                      showBread: true,
                      title: 'Scribe - Subjects',
                      username: req.session.user.username,
                    }
                  });
                }
              } else {
                console.error(err);
                try {
                  res.status(500).send();
                } catch (e) {
                  console.error(e);
                }
              }
            });
          }
        } else {
          console.error(err);
          try {
            res.status(500).send();
          } catch (e) {
            console.error(e);
          }
        }
      });
    }
  });
});

router.get('*', (req, res) => {
  res.status(404).render('notFound', {
    my: {
      nav: true,
      topic: true,
      showBread: true,
      title: 'Scribe - 404',
      username: req.session.user.username,
    }
  });
});

module.exports = router;
