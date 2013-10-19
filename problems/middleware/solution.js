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
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
});

personSchema.pre('save', function(next){
  this.lastModified = Date.now();
  next();
});

var Person = db.model('Person', personSchema);

Person.findOne({name: "Officer Bungus"}, function(err, person){
  person.score += 10;
  person.save(function(err, newPerson){
    process.exit();
  });
});