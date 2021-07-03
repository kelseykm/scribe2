const express = require('express');
const session = require('express-session');
const multer = require('multer');
const exphbs = require('express-handlebars');
const minifyHTML = require('express-minify-html');
const compression = require('compression');
const dotenv = require('dotenv');
const connectSqlite3 = require('connect-sqlite3');
const path = require('path');
const https = require('https');
const http = require('http');
const fs = require('fs');
const crypto = require('crypto');
const { aesCfbCipher } = require('./cryptography');

dotenv.config();
const app = express();
const SQLiteStore = connectSqlite3(session);

require('./setup');
const textNotesDir = path.join(process.env.PWD, 'db', 'text_notes');
const voiceNotesDir = path.join(process.env.PWD, 'db', 'voice_notes');

//View Engine
let hbs = exphbs.create({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: {
    generateVoiceNoteLink: (noteSecurityKey, fileName) => aesCfbCipher.decrypt(
      noteSecurityKey,
      fs.readFileSync(
        path.join(voiceNotesDir, fileName.toString())
      ).toString()
    ),
    getTextNote: (noteSecurityKey, fileName) => aesCfbCipher.decrypt(
      noteSecurityKey,
      fs.readFileSync(
        path.join(textNotesDir, fileName.toString())
      ).toString()
    ),
    generateTopicLink: (linkPath, topicName, id) => {
      topicName = topicName.toString().toLowerCase().replaceAll(' ', '-');
      return `${linkPath}${encodeURIComponent(topicName)}?id=${id.toString()}`;
    }
  }
});
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

//Middleware
app.use(compression());
app.use(minifyHTML({
  override: true,
  exception_url: false,
  htmlMinifier: {
    removeComments: true,
    collapseWhitespace: true,
    minifyJS: true,
    minifyCSS: true,
  }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer({}).none());
app.use(session({
  store: new SQLiteStore({ db: ':memory:' }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  genid: req => crypto.createHash('sha256').update(crypto.randomBytes(512)).digest('hex'),
  cookie: {
    httpOnly: true,
    secure: true,
    saveUninitialized: false,
  }
}));
app.use(express.static(path.join(process.env.PWD, 'public')));
app.use('/accounts', require('./routes/accounts'));
app.use('/subjects', require('./routes/subjects'));

//Routes
app.get('/', (req, res) => {
  if (req.session.user) return res.redirect('/subjects');
  res.redirect('/accounts/log-in');
});

app.get('*', (req, res) => {
  let loggedIn = req.session.user ? true : false;
  res.status(404).render('notFound', {
    layout: 'notFoundLayout',
    my: {
      nav: loggedIn,
      showBread: loggedIn,
      title: 'Scribe - 404',
      username: loggedIn,
    }
  });
});

//Start server
https.createServer({
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem'),
  passphrase: process.env.KEY_PASSPHRASE
}, app).listen(process.env.HTTPS_PORT);

http.createServer((req, res) => {
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();
}).listen(process.env.HTTP_PORT);
