var chai = require('chai');
var expect = chai.expect;

var request = require('supertest');
var app = require('../../server/server.js').app;

describe('get request', function() {
  it('should return something', function (done) {
    request(app)
      .get('/')
      .expect(200, done);
  })
});