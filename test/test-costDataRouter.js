const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');
const should = chai.should();
const expect = chai.expect;
const {TEST_DATABASE_URL, PORT} = require('../config');
const {CostData} = require('../costData/models');
const faker = require('faker');
chai.use(chaiHttp);

function seedCostData() {
  console.log('seeding data');
  const seedData = [];
  for (let i=1; i<=10; i++) {
    seedData.push(generateCostData());
  }
  return CostData.insertMany(seedData);
}
function generateCostData() {
  return {
    discription: faker.lorem.word(),
    history: {
      amount: faker.random.number(),
      createdAt: faker.date.recent(),
      place: faker.lorem.words()
    }
}
}
function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('CostData API resource', function() {
  // before(function() {
  //   return runServer(TEST_DATABASE_URL, PORT);
  // });
  // beforeEach(function() {
  //   return seedCostData();
  // });
  // afterEach(function() {
  //   return tearDownDb();
  // });
  // after(function() {
  //   return closeServer();
  // });

  xit('should return all existing cost data', function() {
    let res;
     return chai.request(app)
       .get('/api/dashboard')
       .then(function(_res) {
         res = _res;
         res.should.have.status(200);
         res.body.should.have.lengthOf.at.least(1);
         return CostData.count();
       })
       .then(count => {
         expect(res.body).to.have.lengthOf(count);
       })
       .catch(err => {
         throw err;
       });
   });
 });