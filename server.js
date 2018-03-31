require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const {CLIENT_ORIGIN, PORT, DATABASE_URL} = require('./config');
const { router: dataRouter } = require('./costData/router');
mongoose.Promise = global.Promise;

app.use( cors({ origin: CLIENT_ORIGIN }));
app.use('/api', dataRouter);

app.get('/hi', (req, res) => {
   res.json({ok: true, text: 'Hi from server'});
 });

// app.use('*', (req, res) => {
//   let message = 'Page Not Found';
//   return res.status(404).json({ error: message });
// });

let server;

// this function starts the server.
// it is also used in integration tests.
function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
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