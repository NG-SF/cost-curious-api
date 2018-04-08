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

let userId, dataId;
const username = 'cooper';
const password = 'TwinPeaks888';
const firstName = 'Dale';
const lastName = 'Cooper';

function createUser() {
console.log('creating user');
  return User.create({
        username,
        password,
        firstName,
        lastName })
    .then(() => User.find({username}))
    .then(user => {
      userId = user[0]._id;
      seedCostData();
    })
    .catch((err) => console.log(err));   
}

function seedCostData() {
  console.log('seeding data');
  const seedData = [];
  for (let i=1; i<=3; i++) {
    seedData.push(generateCostData());
  } 
     dataId = seedData[0]._id; 
  return CostData.insertMany(seedData);
}

function generateCostData() { 
  return {
    description: faker.lorem.word(),
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
  User.remove({});
  return mongoose.connection.dropDatabase();
}

describe('CostData API CATEGORY Routes', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL, PORT, true);
  });
  after(function() { 
    return closeServer();
  });
  beforeEach(function() {
    return createUser();
  });
  afterEach(function() {  
    return tearDownDb();
  });

  it('should GET History Data from specific Category Route', function() {
     return chai.request(app) 
       .get(`/api/dashboard/${userId}`)
       .then((res) => {
         res.should.have.status(200);
         res.body.should.have.lengthOf(3);
         expect(res).to.be.json;
          res.body.forEach(function(item) {
            expect(item).to.be.a('object');
            expect(item).to.include.keys(
              '_id', 'history', 'userId', 'description');
          });
       })
       .catch(err => console.log(err));
   });

  it('should CREATE New Category Route', function() {
    const newCategory = {
      description: 'Coffee'
    };
    let res;
      return chai.request(app)
        .post(`/api/dashboard/${userId}`)
        .send(newCategory)
        .then(function(_res) {
          res = _res;
          expect(res).to.be.json;
          res.body.forEach(function(item) {
            expect(item).to.be.a('object');
            expect(item).to.include.keys(
              '_id', 'history', 'userId', 'description');
            });
          expect(res.body[3].description).to.equal(newCategory.description);
          return CostData.findById(res.body[3]._id);
        })
        .then(function(category) {
          expect(category.description).to.equal(newCategory.description);
        })
        .catch(function (err) {
            throw err;
          });
    });
  
  it('should DELETE Category Route', function(){
    let res, itemId, count;
      return chai.request(app)
            .get(`/api/dashboard/${userId}`)
      .then(_res => {
          res = _res;
          itemId = res.body[0]._id;
          count = res.body.length;
        return chai.request(app)
                .delete(`/api/dashboard/${userId}/${itemId}`);
      })
        .then(function(res) {
          expect(res.body.length).to.equal(count - 1);
          return CostData.findById(itemId);        
        })
        .then(category => {
          expect(category).to.be.null;
        })
        .catch(function (err) {
            throw err;
          });
  });

  it('should UPDATE Category Route', function(){
    let res, itemId;
    let updates = {
      description: 'Uber'
    };
    return chai.request(app)
               .get(`/api/dashboard/${userId}`)
               .then(function(_res) {
          res = _res;
          itemId = res.body[0]._id;
          return chai.request(app)
                     .put(`/api/dashboard/${userId}/${itemId}`)
                     .send(updates)
        })
        .then(function(res) {
          expect(res.body[0].description).to.equal(updates.description);
        })
        .catch(function (err) {
            throw err;
        });
  });
});

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

