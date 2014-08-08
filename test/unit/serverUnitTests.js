var chai = require('chai');
var expect = chai.expect;
var User = require('../../server/api/users/userModel.js');
var neo4j = require('neo4j')

var request = require('supertest');
var app = require('../../server/server.js').app;

var neo4jurl = 'http://localhost:7474'
var db = new neo4j.GraphDatabase(neo4jurl);

var testPlace = {
  'name': 'name',
  'lat': 0,
  'lng': 1,
  'checkinTime': 'null',
  'likes': 'null',
  'photos': 'null',
  'caption': 'null',
  'foursquareID': 'null',
  'country': 'null',
  'category': 'null'
};

var testUser = {
  facebookID: 123456789,
  name: "Testy McTest"
}

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
    User.createUniqueUser(testUser).then(function(data){
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
});