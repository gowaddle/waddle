var _ = require('lodash');
var Q = require('q');
var Checkin = require('./checkinModel.js');
var User = require('../users/userModel.js');
var foursquareUtils = require('../../utils/foursquareUtils.js');
var instagramUtils = require('../../utils/instagramUtils.js');

var checkinController = {};

checkinController.instagramHubChallenge = function (req, res) {
  res.status(200).send(req.query['hub.challenge']);
};

checkinController.handleIGPost = function (req, res) {
  var updateArr = req.body;

  var posts = _.map(updateArr, function (update) {
    return instagramUtils.handleUpdateObject(update);
  })

  Q.all(posts)
  .then(function (postArr) {
    // write to db using batch query
    console.log(JSON.stringify(postArr));

    var flatPostArr = _.flatten(postArr);

    var queries = _.map(flatPostArr, function (post) {
      return post.user.addCheckins([post.checkin]);
    });

    return Q.all(queries);
  })
  .then(function (data) {
    console.log(JSON.stringify(data));
  })
  .catch(function (e) {
    console.log(e);
  });

  res.status(200).end();//test
};

checkinController.realtimeFoursquareData = function (req, res) {
  var checkin = JSON.parse(req.body.checkin);
  var userFoursquareID = checkin.user.id;
  var user;

  User.findByFoursquareID(userFoursquareID)
  .then(function (userNode) {
    user = userNode;
    return foursquareUtils.parseCheckin(checkin);
  })
  .then(function (parsedCheckin) {
    return user.addCheckins([parsedCheckin]);
  })
  .then(function (data) {
    console.log(data);
    res.status(202).end();
  })
  .catch(function (err) {
    console.log(err);
    res.status(500).end();
  });
};

checkinController.addToBucketList = function (req, res){
  var checkinID = req.body.checkinID;
  var facebookID = req.body.facebookID;
  Checkin.addToBucketList(facebookID, checkinID)
  .then(function (data){
    res.json(data);
    res.status(201).end();
  })
  .catch(function (err) {
    console.log(err);
    res.status(500).end();
  });
};

checkinController.addComment = function (req, res){
  var clickerID = req.body.clickerID;
  var checkinID = req.body.checkinID;
  if (req.body.text) {
    var text = req.body.text;
  } else {
    res.status(404).end()
  }

  Checkin.addComment(clickerID, checkinID, text)
  .then(function (data){
    console.log(data);
    res.json(data);
    res.status(201).end();
  })
  .catch(function (err) {
    console.log(err);
    res.status(500).end();
  })
};

checkinController.giveProps = function (req, res){
  var clickerID = req.body.clickerID;
  var checkinID = req.body.checkinID;

  Checkin.giveProps(clickerID, checkinID)
  .then(function (data){
    console.log(data)
    res.json(data);
    res.status(201).end();
  })
  .catch(function (err){
    console.log(err);
    res.status(500).end();
  })
};

checkinController.getPropsAndComments = function (req, res){
  var checkinID = req.params.checkinid;
  var data = {}

  Checkin.getProps(checkinID)
  .then(function (props){
    data['props'] = props;
    return Checkin.getComments(checkinID);
  })
  .then(function (comments){
    if (typeof comments === "object")
    data['comments'] = comments;
    var parsedData = {
      props: data.props.length,
      propGivers: [],
      comments: []
    };

    // for (var i = 0; i < data.props.length; i++){
    //   parsedData.propGivers.push(data.props[i].user._data.data)
    // };    
    parsedData.propGivers = _.map(data.props, function (prop) {
      return prop.user._data.data
    });

    // for (var i = 0; i < data.comments.length; i++){
    //   parsedData.comments.push({
    //     commenter: data.comments[i].user._data.data, 
    //     comment: data.comments[i].comment._data.data
    //   })
    // };
    parsedData.comments = _.map(data.comments, function (comment) {
      return {
        commenter: comment.user._data.data, 
        comment: comment.comment._data.data
      }
    });

    res.json(parsedData);
    res.status(200).end();
  })
  .catch(function (err){
    console.log(err);
    res.status(500).end();
  })
};

module.exports = checkinController;
