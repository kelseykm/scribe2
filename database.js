const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DATABASE = path.join(process.env.PWD, 'db', 'scribeDB.sqlite3');
const db = new sqlite3.Database(DATABASE, err => {
  if (err) console.error(err);
});

db.serialize(() => {
  db.run('PRAGMA journal_mode = WAL');
  // PRAGMA wal_checkpoint; --> for manually running checkpoints

  db.run('PRAGMA foreign_keys = ON');

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER,
    username  TINYTEXT NOT NULL,
    email TINYTEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    note_security_salt TINYTEXT NOT NULL,
    encrypted_note_security_key MEDIUMTEXT NOT NULL,
    creation_time DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
    PRIMARY KEY(id AUTOINCREMENT)
  )`, err => {
    if (err) console.error(err);
  });

  db.run(`CREATE TABLE IF NOT EXISTS subjects (
    user_id INTEGER NOT NULL,
    subject_name TINYTEXT NOT NULL,
    creation_time DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
    CONSTRAINT unique_subjects UNIQUE(user_id, subject_name),
    FOREIGN KEY (user_id) REFERENCES users(id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
  )`, err => {
    if (err) console.error(err);
  });

  db.run(`CREATE TABLE IF NOT EXISTS sections (
    user_id INTEGER NOT NULL,
    subject_name TINYTEXT NOT NULL,
    section_name TINYTEXT NOT NULL,
    creation_time DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
    CONSTRAINT unique_sections UNIQUE(user_id, subject_name, section_name),
    FOREIGN KEY (user_id, subject_name)
      REFERENCES subjects(user_id, subject_name)
        ON UPDATE CASCADE
        ON DELETE CASCADE
  )`, err => {
    if (err) console.error(err);
  });

  db.run(`CREATE TABLE IF NOT EXISTS topics (
    topic_id TINYTEXT NOT NULL,
    user_id INTEGER NOT NULL,
    subject_name TINYTEXT NOT NULL,
    section_name TINYTEXT NOT NULL,
    topic_name TINYTEXT NOT NULL,
    creation_time DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
    CONSTRAINT unique_ids UNIQUE (user_id, topic_id),
    CONSTRAINT unique_topics UNIQUE(user_id, subject_name, section_name, topic_name),
    FOREIGN KEY (user_id, subject_name, section_name)
      REFERENCES sections(user_id, subject_name, section_name)
        ON UPDATE CASCADE
        ON DELETE CASCADE
  )`, err => {
    if (err) console.error(err);
  });

  db.run(`CREATE TABLE IF NOT EXISTS notes (
    user_id INTEGER NOT NULL,
    topic_id TINYTEXT NOT NULL,
    entry_name  TEXT NOT NULL,
    text_note_entry TINYTEXT UNIQUE,
    voice_note_entry TINYTEXT UNIQUE,
    creation_time DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
    CONSTRAINT unique_entries UNIQUE(user_id, topic_id, entry_name),
    FOREIGN KEY (user_id, topic_id)
      REFERENCES topics(user_id, topic_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
  )`, err => {
    if (err) console.error(err);
  });
});

module.exports = db;
