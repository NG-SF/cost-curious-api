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
router.get('/:dataId', jwtAuth, (req, res) => {
  Features.find({dataId: req.params.dataId})
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
router.post('/:dataId', jwtAuth, (req, res) => {
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
    dataCategory: req.body.dataCategory,
    dataId: req.params.dataId })
  .then(() => Features.find({dataId: req.params.dataId}))
  .then(data => res.json(data))
  .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Sorry, server error' });
    });
});

//UPDATE Data Route
router.put('/:dataId', jwtAuth, (req, res) => {
  const toUpdate = {limit: req.body.limit};

  Features.findByIdAndUpdate(req.body.limitId, {$set: toUpdate})
  .then(() => Features.find({dataId: req.params.dataId}))
  .then(data => res.json(data))
  .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Sorry, internal error' });
    });
});

// DELETE Data Route
router.delete('/:dataId', jwtAuth, (req, res) => {
  Features.findByIdAndRemove(req.body.limitId)
    .then(() => Features.find({dataId: req.params.dataId}))
    .then(data => res.json(data))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: "Can't delete your transaction. Something went wrong."});
    });
});

module.exports = { router };