var mongoose = require('mongoose');

var db = mongoose.createConnection("mongodb://localhost:9001/workshop");

db.once('connected', function(){
  console.log('Connected!');
  process.exit();
});