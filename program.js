var mongoose = require('mongoose');

var db = process.argv[1];
var conn = mongoose.createConnection(db);

conn.once('connected', function(){
  console.log('Connected to', db);
});