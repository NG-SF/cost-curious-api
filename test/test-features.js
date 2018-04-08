const chai = require('chai');
const chaiHttp = require('chai-http');
const {TEST_DATABASE_URL, PORT} = require('../config');
const {app, runServer, closeServer} = require('../server');
const mongoose = require('mongoose');
const {Features} = require('../features/model');
const faker = require('faker');
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);
let dataId;
function seedFeaturesData() {
  const seedData = [{
      limit: '500',
      dataCategory: 'Lyft',
      dataId: '111' 
    }];
    dataId = seedData[0].dataId; 
  return Features.insertMany(seedData);
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}
    
describe('Features Routes /features/:dataId', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL, PORT, true);
  });
  after(function() { 
    return closeServer();
  });
  beforeEach(function() {
    return seedFeaturesData();
  });
  afterEach(function() {  
    return tearDownDb();
  });

  it('should GET data', function() {
     return chai.request(app)
       .get(`/features/${dataId}`)
       .then(function(res) {
         res.should.have.status(200);
         res.should.be.json;
         res.body.forEach(function(item) {
            expect(item).to.be.a('object');
            expect(item).to.include.keys(
              'limit', 'dataCategory', 'dataId', '_id');
              });
          });
    });

  it('should CREATE new data', function() {
    const newLimit = {
      limit: '3000',
      dataCategory: 'Vacation',
    };
    let res;
      return chai.request(app)
        .post(`/features/${'newDataId'}`)
        .send(newLimit)
        .then(function(_res) {
          res = _res;
      console.log('body======', res.body);
          expect(res).to.be.json;
          res.body.forEach(function(item) {
            expect(item).to.be.a('object');
            expect(item).to.include.keys(
              'limit', 'dataCategory', 'dataId', '_id');
              });
          expect(res.body[0].limit).to.equal(newLimit.limit);
          return Features.findById(res.body[0]._id);
        })
        .then(function(data) {
          expect(data.limit).to.equal(newLimit.limit);
        })
        .catch(function (err) {
            throw err;
          });
    });

  it('should DELETE Category Route', function(){
    let res, limitId;
      return chai.request(app)
            .get(`/features/${dataId}`)
      .then(_res => {
          res = _res;
          limitId = res.body[0]._id;
        return chai.request(app)
                .delete(`/features/${dataId}`)
                .send({ 'limitId': limitId });
      })
        .then(function(res) {
          expect(res.body.length).to.equal(0);
          return Features.findById(limitId);        
        })
        .then(data => {
          expect(data).to.be.null;
        })
        .catch(function (err) {
            throw err;
          });
  });

  it('should UPDATE Category Route', function(){
    let res, limitId;
    return chai.request(app)
               .get(`/features/${dataId}`)
               .then(function(_res) {
          res = _res;
          limitId = res.body[0]._id;
          return chai.request(app)
                     .put(`/features/${dataId}`)
                     .send({ 'limitId': limitId,
                            'limit': '444' })
        })
        .then(function(res) {
          expect(res.body[0].limit).to.equal('444');
        })
        .catch(function (err) {
            throw err;
        });
    });
});