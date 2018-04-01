const chai = require('chai');
const chaiHttp = require('chai-http');
const {app} = require('../server');
const should = chai.should();

chai.use(chaiHttp);

describe('API', function() {
  it('should 200 on GET requests', function() {
     return chai.request(app)
       .get('/test')
       .then(function(res) {
         res.should.have.status(200);
         res.should.be.json;
       });
   });
  it('should 404 on GET requests to nonexistent routes', function() {
     return chai.request(app)
       .get('/test/foo123')
       .then(function(res) {
         res.should.have.status(404);
         res.should.be.json;
       });
   });
 });