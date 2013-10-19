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

var q = Person.find();
q.sort('-score');
q.limit(3);

q.exec(function(err, people){
  console.log(people[0].name, people[1].name, people[2].name);
  process.exit();
});