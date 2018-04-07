const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');
const mongoose = require('mongoose');
const should = chai.should();
const expect = chai.expect;
const {TEST_DATABASE_URL, PORT} = require('../config');
const {CostData} = require('../costData/models');
const {User} = require('../users/models');
const faker = require('faker');
chai.use(chaiHttp);

let userId; 
let dataId;

// function generateUsers() {
//   User.create(user)
//   .then(user => {
//     userId = user._id;
//     console.log('user id promise', userId);
// });
// }

  let user = {username: 'user1', password: 'password123'};

function seedCostData() {
  console.log('seeding data');
  const seedData = [];
  for (let i=1; i<=5; i++) {
    seedData.push(generateCostData());
  } 
     dataId = seedData[0]._id; 
  return CostData.insertMany(seedData);
}

function generateCostData() {
  return {
    discription: faker.lorem.word(),
    userId: userId,
    "_id": mongoose.Types.ObjectId(),
    history: [{
      amount: 500,
      createdAt: 1522795973131,
      place: faker.lorem.words()
      }, {
      amount: 777,
      createdAt: 1519329600000,
      place: faker.lorem.words()
      }, {
      amount: 305,
      createdAt: 1519339600000,
      place: faker.lorem.words()
      }
    ]    
  };
}
function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

console.log('data id======',dataId);
console.log('user id======',userId);

describe('CostData API NESTED History Routes', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL, PORT, true);
  });
  beforeEach(function() {
    return seedCostData();
  });
  afterEach(function() {
    return tearDownDb();
  });
  after(function() {
    return closeServer();
  });

  it('should GET History Data from specific Category Route', function() {
    let res;
     return chai.request(app)
       .get(`/api/${dataId}`)
       .then(function(_res) {
         res = _res;
        //  console.log('res======',res);
         res.should.have.status(200);
         res.body.should.have.lengthOf.at.least(1);
       })
       .catch(err => console.log(err));
   });

  it('should return History data with right fields', function() {
 // Strategy: Get back all blog posts, and ensure they have expected keys
    let res;
      return chai.request(app)
        .get(`/api/${dataId}`)
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          res.body.forEach(function(item) {
            expect(item).to.be.a('object');
            expect(item).to.include.keys(
              '_id', 'amount', 'createdAt', 'place');
          });
        })
        .catch(function (err) {
            throw err;
          });
    });

    it('should CREATE New transaction for specific Category Route', function() {
    const newTransaction = {
      amount: 444,
      createdAt: 1519338600000,
      place: faker.lorem.sentence()
    };
    let res;
      return chai.request(app)
        .post(`/api/${dataId}`)
        .send(newTransaction)
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          res.body.forEach(function(item) {
            expect(item).to.be.a('object');
            expect(item).to.include.keys(
              '_id', 'amount', 'createdAt', 'place');
          });
          expect(res.body[3].amount).to.equal(newTransaction.amount);
          expect(res.body[3].createdAt).to.equal(newTransaction.createdAt);
          expect(res.body[3].place).to.equal(newTransaction.place);
          return CostData.findById(dataId);
        })
        .catch(function (err) {
            throw err;
          });
    });
  
  it('should DELETE specific transaction in history of specific Category Route', function(){
    let res, itemId, count;
      return chai.request(app)
        .get(`/api/${dataId}`)
        .then(function(_res) {
          res = _res;
          itemId = res.body[0]._id;
          count = res.body.length;
          return chai.request(app).delete(`/api/${dataId}/${itemId}`)
        })
        .then(function(res) {
          expect(res.body.length).to.equal(count - 1);
        })
        .catch(function (err) {
            throw err;
          });
  });

   it('should UPDATE transaction for specific Category Route', function(){
    let res, itemId;
    let updates = {
      place: 'Red door'
    };
      return chai.request(app)
        .get(`/api/${dataId}`)
        .then(function(_res) {
          res = _res;
          itemId = res.body[0]._id;
          return chai.request(app)
                     .put(`/api/${dataId}/${itemId}`)
                     .send(updates)
        })
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res.body[0].place).to.equal(updates.place);
        })
        .catch(function (err) {
            throw err;
          });
  });
 });

describe('CostData API CATEGORY Routes', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL, PORT, true);
  });
  beforeEach(function() {
    return seedCostData();
  });
  afterEach(function() {
    return tearDownDb();
  });
  after(function() {
    return closeServer();
  });

  xit('should GET History Data from specific Category Route', function() {
    let res;
     return chai.request(app)
       .get(`/api/dashboard/${userId}`)
       .then(function(_res) {
         res = _res;
        console.log('res======',res.body);
         res.should.have.status(200);
         res.body.should.have.lengthOf.at.least(1);
       })
       .catch(err => console.log(err));
   });

  xit('should return History data with right fields', function() {
 // Strategy: Get back all blog posts, and ensure they have expected keys
    let res;
      return chai.request(app)
        .get(`/api/${dataId}`)
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          res.body.forEach(function(item) {
            expect(item).to.be.a('object');
            expect(item).to.include.keys(
              '_id', 'amount', 'createdAt', 'place');
          });
        })
        .catch(function (err) {
            throw err;
          });
    });

    xit('should CREATE New transaction for specific Category Route', function() {
    const newTransaction = {
      amount: 444,
      createdAt: 1519338600000,
      place: faker.lorem.sentence()
    };
    let res;
      return chai.request(app)
        .post(`/api/${dataId}`)
        .send(newTransaction)
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          res.body.forEach(function(item) {
            expect(item).to.be.a('object');
            expect(item).to.include.keys(
              '_id', 'amount', 'createdAt', 'place');
          });
          expect(res.body[3].amount).to.equal(newTransaction.amount);
          expect(res.body[3].createdAt).to.equal(newTransaction.createdAt);
          expect(res.body[3].place).to.equal(newTransaction.place);
          return CostData.findById(dataId);
        })
        .catch(function (err) {
            throw err;
          });
    });
  
  xit('should DELETE specific transaction in history of specific Category Route', function(){
    let res, itemId, count;
      return chai.request(app)
        .get(`/api/${dataId}`)
        .then(function(_res) {
          res = _res;
          itemId = res.body[0]._id;
          count = res.body.length;
          return chai.request(app).delete(`/api/${dataId}/${itemId}`)
        })
        .then(function(res) {
          expect(res.body.length).to.equal(count - 1);
        })
        .catch(function (err) {
            throw err;
          });
  });

   xit('should UPDATE transaction for specific Category Route', function(){
    let res, itemId;
    let updates = {
      place: 'Red door'
    };
      return chai.request(app)
        .get(`/api/${dataId}`)
        .then(function(_res) {
          res = _res;
          itemId = res.body[0]._id;
          return chai.request(app)
                     .put(`/api/${dataId}/${itemId}`)
                     .send(updates)
        })
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res.body[0].place).to.equal(updates.place);
        })
        .catch(function (err) {
            throw err;
          });
  });
 });