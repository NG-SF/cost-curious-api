const express = require('express'),
      bodyParser = require('body-parser'),
      jsonParser = bodyParser.json(),
      mongoose = require('mongoose'),
      router = express.Router(),
      { CostData } = require('./models'),
      app = express();

mongoose.Promise = global.Promise;

// router.use(bodyParser.urlencoded({ extended: true }));

// GET Data Route
router.get('/dashboard', (req, res) => {
  CostData.find()
  .then(data => {
   res.json(data);
  });
});

// CREATE New Category Route
router.post('/dashboard', jsonParser, (req, res) => {
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

  CostData.create({description: req.body.description})
  .then(data => res.status(201).json(data))
  .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Sorry, internal error' });
    });
});

// DELETE Category Route
router.delete('/dashboard/:id', (req, res) => {
  CostData
    .findByIdAndRemove(req.params.id)
    .then(() => {res.status(204).json({message: "Successfuly removed your item"})})
    .catch(err => {
      console.error(err);
      res.status(500).json({message: "Can't delete your post. Something went wrong."});
    });
});

// UPDATE Category Route
router.put('/dashboard/:id', jsonParser, (req, res) => {
  const toUpdate = {};
  const updatableFields = ['description'];
console.log('REQ.Body====',req.body);

  updatableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });
  CostData.findByIdAndUpdate(req.params.id, { $set: toUpdate })
  .then(costData => { res.status(204).json(costData);})
  .catch(err => res.status(500).json({ message: 'Sorry, internal error' }));
});

// GET Data History from specific Category Route
router.get('/:name', (req, res) => {
  CostData.find({description: req.params.name})
  .then(data => {
    console.log(data);
   res.json(data[0].history);
  });
});

// CREATE New transaction for specific Category Route
router.post('/:name', jsonParser, (req, res) => {
  console.log(req.body);
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

  CostData.find({description: req.params.name})
  .then(data => {
    data[0].history.push(transaction);
    return data[0].save();
  })
  .then(() => CostData.find({description: req.params.name}))
  .then(data => {
    res.status(201).json(data[0].history)
  })
  .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Sorry, internal error' });
    });
});

//UPDATE transaction for specific Category Route
router.put('/:name/:itemId', jsonParser, (req, res) => {
  const toUpdate = {};
  const updatableFields = ['amount', 'createdAt', 'place'];
  updatableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });
  CostData.find({description: req.params.name})
  .then(data => {
    const history = data[0].history.id(req.params.itemId);
    history.set(toUpdate);
    return data[0].save();
  })
  .then(() => CostData.find({description: req.params.name}))
  .then(data => {
    res.status(201).json(data[0].history)
  })
  .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Sorry, internal error' });
    });
});

// DELETE specific transaction in history of specific Category Route
router.delete('/:name/:itemId', (req, res) => {
  CostData.find({description: req.params.name})
  .then(data => {
    data[0].history.id(req.params.itemId).remove();
    return data[0].save();
  })
    .then(() => {res.status(204).json({message: "Successfuly removed your item"})})
    .catch(err => {
      console.error(err);
      res.status(500).json({message: "Can't delete your transaction. Something went wrong."});
    });
});

module.exports = { router };
