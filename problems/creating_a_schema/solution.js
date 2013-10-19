var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var db = mongoose.createConnection("mongodb://localhost:9001/workshop");

var personSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    default: 0
  }
});

var Person = db.model('Person', personSchema);

process.exit();