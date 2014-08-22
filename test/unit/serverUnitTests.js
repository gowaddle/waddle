//run mocha

var chai = require('chai');
var expect = chai.expect;
var User = require('../../server/api/users/userModel.js');
var instagramUtils = require('../../server/utils/instagramUtils.js');
var neo4j = require('neo4j');
var request = require('supertest');
var fixtures = require('../test.fixtures.js');

var neo4jurl = 'http://localhost:7474'
var db = new neo4j.GraphDatabase(neo4jurl);


describe('createUniqueUser function', function() {
  var responseData;
  beforeEach(function(done){
    User.createUniqueUser(fixtures.testUser).then(function(data){
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

describe('parseIGPost function', function() {

  it('is', function () {
    expect(1).to.equal(1)
  });

  it('Parses some IG data', function () {
    // Need to change to stub
    instagramUtils.parseIGPost(fixtures.IGdata.data[0])
    .then (function (parsedData){
      console.log(parsedData)
      expect(parsedData[0].checkinID).to.equal('22987123')
      expect(parsedData[0].lat).to.equal(37.77956816727314)
      expect(parsedData[0].likes).to.equal(190)
      expect(parsedData[0].photoSmall).to.equal('http://distillery.s3.amazonaws.com/media/2011/02/03/efc502667a554329b52d9a6bab35b24a_5.jpg')
      expect(parsedData[0].photoLarge).to.equal('http://distillery.s3.amazonaws.com/media/2011/02/03/efc502667a554329b52d9a6bab35b24a_7.jpg') 
    })
  });
});

