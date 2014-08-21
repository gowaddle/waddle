//run mocha

var chai = require('chai');
var expect = chai.expect;
var User = require('../../server/api/users/userModel.js');
var instagramUtils = require('../../server/utils/instagramUtils.js');
var neo4j = require('neo4j');
var request = require('supertest');
var app = require('../../server/server.js').app;
var server = require('../../server/server.js');
var request = require('supertest');
var fixtures = require('../test.fixtures.js');

var neo4jurl = 'http://localhost:7474'
var db = new neo4j.GraphDatabase(neo4jurl);


describe('Get request', function() {
  it('should return something', function (done) {
    request(app)
      .get('/')
      .expect(200, done);
  })
});

describe('createUniqueUser function', function() {
  var responseData;
  beforeEach(function(done){
    User.createUniqueUser(fixtures.testUser).then(function(data){
      console.log("TESTTTTT", data.node._data)
      responseData = data;
      done();
    })
  });
  
  it('Returns that user data on createUniqueUser', function () {
    expect(responseData.node._data).to.not.be.undefined;
  });
   
  it('Returns the facebookID passed in', function () {
    expect(responseData.node._data.data.facebookID).to.equal(123456789);
  });

    it('Returns the facebookID passed in', function () {
    expect(responseData.node._data.data.name).to.equal("Testy McTest");
  }); 
})

describe('parseIGData function', function() {

  it('Sends a 200 status for IG', function (done) {
    request(app)
    .post('/api/checkins/realtimeinstagram')
    .send(fixtures.IGdata)
    .expect(200)
    .end(function(err, res){
      if (err) throw err;
      done();
    })
  });

  it('is', function () {
    expect(1).to.equal(1)
  });

  it('Parses some IG data', function () {
    console.log(instagramUtils.parseIGData(fixtures.IGdata.data))
    expect(1).to.equal(1)
  });
});

