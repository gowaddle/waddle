var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
var app = require('../../server/server.js').app;
var server = require('../../server/server.js');
var fixtures = require('../test.fixtures.js');


describe('Get request', function() {
  it('should return something', function (done) {
    request(app)
      .get('/')
      .expect(200, done);
  })
});

describe('Answer Challenges', function() {

  it('Sends a 200 status to make Facebook happy', function (done) {
    request(app)
    .post('/api/checkins/realtimefacebook')
    .send(fixtures.IGdata)
    .expect(200)
    .end(function(err, res){
      if (err) throw err;
      done();
    })
  });

  it('Sends a 200 status to make Instagram happy', function (done) {
    request(app)
    .post('/api/checkins/realtimeinstagram')
    .send(fixtures.IGdata)
    .expect(200)
    .end(function(err, res){
      if (err) throw err;
      done();
    })
  });
});