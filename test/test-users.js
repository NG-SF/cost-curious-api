'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, runServer, closeServer } = require('../server');
const { User } = require('../users/models');
const { TEST_DATABASE_URL } = require('../config');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Users Routes', function () {
  const username = 'coop';
  const password = 'TwinPeaks888';
  const firstName = 'Dale';
  const lastName = 'Cooper';
  const usernameB = 'carter';
  const passwordB = 'Eureka111';
  const firstNameB = 'Jack';
  const lastNameB = 'Carter';

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  after(function () {
    return closeServer();
  });

  afterEach(function () {
    return User.remove({});
  });

describe('/users', function () {
  describe('POST', function () {
    it('Should reject users with missing username', function () {
        return chai
          .request(app)
          .post('/users')
          .send({
            password,
            firstName,
            lastName
          })
          .then((res) => {            
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('username');
          })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            } 
          });
      });
  it('Should reject users with missing password', function () {
        return chai
          .request(app)
          .post('/users')
          .send({
            username,
            firstName,
            lastName
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('password');
          })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            } 
          });
      });
  it('Should reject users with non-string username', function () {
        return chai
          .request(app)
          .post('/users')
          .send({
            username: 1234,
            password,
            firstName,
            lastName
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).to.equal('username');
          })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }  
          });
      });
  it('Should reject users with non-string password', function () {
        return chai
          .request(app)
          .post('/users')
          .send({
            username,
            password: 1234,
            firstName,
            lastName
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).to.equal('password');
          })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
  it('Should reject users with non-string first name', function () {
        return chai
          .request(app)
          .post('/users')
          .send({
            username,
            password,
            firstName: 1234,
            lastName
          })
          .then((res) =>{
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).to.equal('firstName');
          })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
  it('Should reject users with non-string last name', function () {
        return chai
          .request(app)
          .post('/users')
          .send({
            username,
            password,
            firstName,
            lastName: 1234
          })
          .then((res) =>{
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).to.equal('lastName');
          })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
  it('Should reject users with non-trimmed username', function () {
        return chai
          .request(app)
          .post('/users')
          .send({
            username: ` ${username} `,
            password,
            firstName,
            lastName
          })
          .then((res) =>{
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Cannot start or end with whitespace'
            );
            expect(res.body.location).to.equal('username');
          })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
  it('Should reject users with non-trimmed password', function () {
        return chai
          .request(app)
          .post('/users')
          .send({
            username,
            password: ` ${password} `,
            firstName,
            lastName
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Cannot start or end with whitespace'
            );
            expect(res.body.location).to.equal('password');
          })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
  it('Should reject users with empty username', function () {
        return chai
          .request(app)
          .post('/users')
          .send({
            username: '',
            password,
            firstName,
            lastName
          })
        .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Must be at least 1 characters long'
            );
            expect(res.body.location).to.equal('username');
        })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
  it('Should reject users with password less than 7 characters', function () {
        return chai
          .request(app)
          .post('/users')
          .send({
            username,
            password: '1234',
            firstName,
            lastName
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Must be at least 7 characters long'
            );
            expect(res.body.location).to.equal('password');
          })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
  it('Should reject users with password greater than 20 characters', function () {
        return chai
          .request(app)
          .post('/users')
          .send({
            username,
            password: new Array(40).fill('a').join(''),
            firstName,
            lastName
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Must be at most 20 characters long'
            );
            expect(res.body.location).to.equal('password');
          })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
  it('Should reject users with duplicate username', function () {
        // Create an initial user
        return User.create({
          username,
          password,
          firstName,
          lastName
        })
          .then(() =>
            // Try to create a second user with the same username
            chai.request(app).post('/users').send({
              username,
              password,
              firstName,
              lastName
            })
          )
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Username already taken'
            );
            expect(res.body.location).to.equal('username');
          })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
  it('Should create a new user', function () {
        return chai
          .request(app)
          .post('/users')
          .send({
            username,
            password,
            firstName,
            lastName
          })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys(
              'username',
              'firstName',
              'lastName',
              'id'
            );
            expect(res.body.username).to.equal(username);
            expect(res.body.firstName).to.equal(firstName);
            expect(res.body.lastName).to.equal(lastName);
            return User.findOne({
              username
            });
          })
          .then(user => {
            expect(user).to.not.be.null;
            expect(user.firstName).to.equal(firstName);
            expect(user.lastName).to.equal(lastName);
            return user.validatePassword(password);
          })
          .then(passwordIsCorrect => {
            expect(passwordIsCorrect).to.be.true;
          });
      });
  it('Should trim firstName and lastName', function () {
        return chai
          .request(app)
          .post('/users')
          .send({
            username,
            password,
            firstName: ` ${firstName} `,
            lastName: ` ${lastName} `
          })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys(
              'username',
              'firstName',
              'lastName',
              'id'
            );
            expect(res.body.username).to.equal(username);
            expect(res.body.firstName).to.equal(firstName);
            expect(res.body.lastName).to.equal(lastName);
            return User.findOne({
              username
            });
          })
          .then(user => {
            expect(user).to.not.be.null;
            expect(user.firstName).to.equal(firstName);
            expect(user.lastName).to.equal(lastName);
          });
      });
    });
  });
});
