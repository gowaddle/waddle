//This data should only be entered into the database one time

//run python -m SimpleHTTPServer in this folder
//node countryModel.js

var neo4j = require('neo4j');
var Q = require('q');

var db = new neo4j.GraphDatabase(process.env['GRAPHENEDB_URL'] || 'http://localhost:7474');

importCSV = function(){

  var query = [
    'LOAD CSV WITH HEADERS FROM "http://localhost:8000/country_data.csv" AS csvLine',
    'CREATE (c:Country { name: csvLine.NAME_LONG })',
  ].join('\n');

  db.query(query, function (err, results) {
    if (err) { console.log(err); }
    else {
      console.log(results)
    }
  });

};

importCSV();
