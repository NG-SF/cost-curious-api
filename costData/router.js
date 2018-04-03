const express = require('express'),
      bodyParser = require('body-parser'),
      jsonParser = bodyParser.json(),
      mongoose = require('mongoose'),
      passport = require('passport'),
      router = express.Router(),
      { CostData } = require('./models'),
      { User } = require('../users/models'),
      app = express();

mongoose.Promise = global.Promise;
router.use(jsonParser);
const jwtAuth = passport.authenticate('jwt', { session: false });

// GET Data Route
router.get('/dashboard/:userId', jwtAuth, (req, res) => {
  User.findById(req.params.userId)
  .then(user => CostData.find({userId: user._id}))
  .then(data => {
   res.json(data);
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({message: "Can't get cost data. Internal server error"});
  });
});

// CREATE New Category Route
router.post('/dashboard/:userId', jwtAuth, (req, res) => {
  console.log(req.body);
  const requiredFields = ['description'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  CostData.create({
    description: req.body.description,
    userId: req.params.userId })
  .then(() => User.findById(req.params.userId))
  .then(user => CostData.find({userId: user._id}))
  .then(data => res.json(data))
  .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Sorry, internal error' });
    });
});

// DELETE Category Route
router.delete('/dashboard/:userId/:id', jwtAuth,(req, res) => {
  CostData
    .findByIdAndRemove(req.params.id)
    .then(() => User.findById(req.params.userId))
    .then(user => CostData.find({userId: user._id}))
    .then(costData => { 
      res.json(costData);})
    // .then(() => {res.status(204).json({message: "Successfuly removed your item"})})
    .catch(err => {
      console.error(err);
      res.status(500).json({message: "Can't delete your item. Something went wrong."});
    });
});

// UPDATE Category Route
router.put('/dashboard/:userId/:id', jwtAuth, (req, res) => {
  const toUpdate = {};
  const updatableFields = ['description'];

  updatableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });
  CostData.findByIdAndUpdate(req.params.id, { $set: toUpdate })
  .then(() => User.findById(req.params.userId))
  .then(user => CostData.find({userId: user._id}))
  .then(costData => { 
    res.json(costData);})
  .catch(err => res.status(500).json({ message: 'Sorry, internal error' }));
});

//++++++++++++++++++++++ Routes for nested history array +++++++++++++++++++++++++
// GET Data History from specific Category Route
router.get('/:dataId', jwtAuth, (req, res) => {
  CostData.findById(req.params.dataId)
  .then(data => {
   res.json(data.history);
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({message: "Can't get cost data. Internal server error"});
  });
});

// CREATE New transaction for specific Category Route
router.post('/:dataId', jwtAuth, (req, res) => {
  const requiredFields = ['amount', 'createdAt'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
 const transaction = {
    amount: req.body.amount,
    createdAt: req.body.createdAt,
    place: req.body.place || ''
    };

  CostData.findById(req.params.dataId)
  .then(data => {
    data.history.push(transaction);
    return data.save();
  })
  .then(() => CostData.findById(req.params.dataId))
  .then(data => {
    res.status(201).json(data.history)
  })
  .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Sorry, internal error' });
    });
});

//UPDATE transaction for specific Category Route
router.put('/:dataId/:itemId', jwtAuth, (req, res) => {
  const toUpdate = {};
  const updatableFields = ['amount', 'createdAt', 'place'];
  updatableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });
  CostData.findById(req.params.dataId)
  .then(data => {
    const history = data.history.id(req.params.itemId);
    history.set(toUpdate);
    return data.save();
  })
  .then(() => CostData.findById(req.params.dataId))
  .then(data => {
    res.status(201).json(data.history)
  })
  .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Sorry, internal error' });
    });
});

// DELETE specific transaction in history of specific Category Route
router.delete('/:dataId/:itemId', jwtAuth,(req, res) => {
  CostData.findById(req.params.dataId)
  .then(data => {
    data.history.id(req.params.itemId).remove();
    return data.save();
  })
  .then(() => CostData.findById(req.params.dataId))
  .then(data => {
    res.json(data.history)
  })
    // .then(() => {res.status(204).json({message: "Successfuly removed your item"})})
    .catch(err => {
      console.error(err);
      res.status(500).json({message: "Can't delete your transaction. Something went wrong."});
    });
});

module.exports = { router };
