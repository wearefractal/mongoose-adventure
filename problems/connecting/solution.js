var mongoose = require('mongoose');

var conn = mongoose.createConnection("mongodb://localhost:9001/workshop");

conn.once('connected', function(){
  console.log('Connected!');
  process.exit();
});