require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');
const passport = require('passport');
const {CLIENT_ORIGIN, PORT, DATABASE_URL, TESTING} = require('./config');
const { router: dataRouter } = require('./costData/router');
const { router: usersRouter } = require('./users/router');
const { router: authRouter } = require('./auth/router');
const { router: featuresRouter } = require('./features/router');
const { localStrategy, jwtStrategy } = require('./auth/strategies');
// mongoose.set('debug', true);
mongoose.Promise = global.Promise;

app.use( cors({ origin: CLIENT_ORIGIN }));
app.use(morgan('common'));
app.use('/api/', dataRouter);
app.use('/users/', usersRouter);
app.use('/auth/', authRouter);
app.use('/features/', featuresRouter);
passport.use(localStrategy);
passport.use(jwtStrategy);


app.get('/test', (req, res) => {
   res.json({ok: true, text: 'Hi from server'});
 });

app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Page Not Found'});
});

let server;

// this function starts the server.
// it is also used in integration tests.
function runServer(databaseUrl = DATABASE_URL, port = PORT, testing=false) {
  // TESTING = testing; 
  testing = TESTING;
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        console.log('Error from mongoose.connect');
        return reject(err);
      }
      server = app
        .listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}
// this function closes the server, and returns a promise.
// it is also used in integration tests.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly, this block
// runs. Export runServer command for testing
if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };