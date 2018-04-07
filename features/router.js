const express = require('express'),
      bodyParser = require('body-parser'),
      jsonParser = bodyParser.json(),
      mongoose = require('mongoose'),
      passport = require('passport'),
      router = express.Router(),
      { Features } = require('./model'),
      TESTING = require('../config'),
      app = express();

mongoose.Promise = global.Promise;
router.use(jsonParser);

const fakeAuth = function(req, res, next) {
  next();
}

const jwtAuth = TESTING ? fakeAuth : passport.authenticate('jwt', { session: false });

// GET Data Route
router.get('/:a/:b/:c', (req, res) => {
  Features.find()
  .then(data => {
   res.json(data);
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({message: "Can't get data. Internal server error"});
  });
});

// CREATE Data Route
//
router.post('/:a/:b/:c', (req, res) => {
// console.log('limit', req.body);
  const requiredFields = ['limit', 'dataCategory'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  Features.create({
    limit: req.body.limit,
    dataCategory: req.body.dataCategory })
  .then(() => Features.find())
  .then(data => res.json(data))
  .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Sorry, server error' });
    });
});

//UPDATE Data Route
router.put('/:a/:b/:c', (req, res) => {
  const toUpdate = {limit: req.body.limit};

  Features.findByIdAndUpdate(req.body.limitId, {$set: toUpdate})
  .then(() => Features.find())
  .then(data => res.status(201).json(data))
  .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Sorry, internal error' });
    });
});

// DELETE Data Route
router.delete('/:a/:b/:c',(req, res) => {
  Features.findByIdAndRemove(req.body.limitId)
    .then(() => Features.find())
    .then(data => res.json(data))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: "Can't delete your transaction. Something went wrong."});
    });
});

module.exports = { router };