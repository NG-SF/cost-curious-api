const express = require('express'),
      bodyParser = require('body-parser'),
      jsonParser = bodyParser.json(),
      mongoose = require('mongoose'),
      router = express.Router(),
      { CostData, Transactions } = require('./models'),
      app = express();

mongoose.Promise = global.Promise;

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// GET Data Route
router.get('/dashboard', (req, res) => {
  CostData.find()
  .then(data => {
   res.json(data);
  });
});

// CREATE Route
router.post('/dashoard', (req, res) => {
  let newData = {
    description: req.body.description
  };

  CostData.create(newData)
  .then((err) => {
    if (err) {
      console.log(err);
    } 
    costData.save();
    console.log('cost data =>', costData);     
    })
  .catch(err => {
      console.error(err);
      let error = "Sorry, server error";
      res.status(500).json({ error: error });
    });
});


//SHOW Route
// router.get('/users/:id', (req, res) => {
//   User.findById(req.params.id)
//   .then(user => {

//   Joke.find({userId: user._id})
//     .then(jokes => {
//       res.render('userPage', { jokes: jokes, user: user });
//     });  
//   }).catch(err => {
//       console.error(err);
//       res.status(500).render('errorMessage', { error: error });
//     });
// });



// EDIT Route 
// router.get('/users/edit/:id', (req, res) => {
//   Joke.findById(req.params.id)
//     .then(joke => res.render('edit', { joke: joke }))
//     .catch(err => {
//       console.log(err);
//       res.status(500).render('errorMessage', { error: error });
//     });
// });

// UPDATE Route
// router.put('/users/:id', (req, res) => {
//   const toUpdate = {};
//   const updatableFields = ['title', 'content', 'image'];
//   console.log(req.body);

//   updatableFields.forEach(field => {
//     if (field in req.body) {
//       toUpdate[field] = req.body[field];
//     }
//   });
  //to remove script tags from user input, in case he tries to 
  //enter them
  // req.body = req.sanitize(req.body);

//   Joke.findByIdAndUpdate(req.params.id, { $set: toUpdate })
//   .then(joke => {
//     res.status(204);
//     const userId = joke.userId;
//     res.redirect('/jokes/users/' + userId);
//     })
//     .catch(err => res.status(500).render('errorMessage', { error: error }));
// });

// DELETE Route
// router.delete('/users/:id', (req, res) => {
//   let error = 'Server error happened while trying to delete a joke';
  
//  Joke.findById(req.params.id)
//  .then(joke => {
//     const userId = joke.userId;
//    Joke.findByIdAndRemove(req.params.id)
//   .then( () => {
//       res.redirect('/jokes/users/' + userId);
//     });
//  })
//   .catch(err => {
//       console.error(err);
//       res.status(500).render('errorMessage', { error: error });
//     }); 
// });


let seedData = [ {
  id: '001',
  description: 'Coffee',
  history: [ {
    amount: 400,
    createdAt: 1521240500000,
    place: 'Peets'
  }, {
    amount: 300,
    createdAt: 1534950400000,
    place: 'Starbucks'
  }, {
    amount: 500,
    createdAt: 1526440400000,
    place: 'Peets'
  },  {
    amount: 700,
    createdAt: 1521149500000,
    place: 'Starbucks'
  }, {
    amount: 900,
    createdAt: 1524940400000,
    place: 'Peets'
  }, {
    amount: 500,
    createdAt: 1526750400000,
    place: 'Starbucks'
  }, {
    amount: 550,
    createdAt: 1527140500000,
    place: 'Starbucks'
  }, {
    amount: 390,
    createdAt: 1522950400000,
    place: 'Peets'
  }, {
    amount: 580,
    createdAt: 1514990400000,
    place: 'Starbucks'
  }
  ]
}, {
  id: '002',
  description: 'Movie',
  history: [{
    amount: 2500,
    createdAt: 1521140500000,
    place: 'Metreon'
  }, {
    amount: 1500,
    createdAt: 1519156800000,
    place: 'Metreon'
  },{
    amount: 2000,
    createdAt: 1521155500000
  }, {
    amount: 2200,
    createdAt: 1521540500000,
    place: 'Metreon'
  }, {
    amount: 2500,
    createdAt: 1521951900000
  }, {
    amount: 1200,
    createdAt: 1522151900000
  }
  ]
}, {
  id: '003',
  description: 'Saving for vacation',
  history: [ {
    amount: 2000,
    createdAt: 1521240500000
  }, {
    amount: 3000,
    createdAt: 1524950400000
  }, {
    amount: 1500,
    createdAt: 1526440400000
  },  {
    amount: 5000,
    createdAt: 1521149500000
  }, {
    amount: 40000,
    createdAt: 1523940400000
  }, {
    amount: 5500,
    createdAt: 1526750400000
  }, {
    amount: 2550,
    createdAt: 1527140500000
  }, {
    amount: 3900,
    createdAt: 1522950400000
  }, {
    amount: 5800,
    createdAt: 1525950400000
  }
  ]
}
];

module.exports = { router };
