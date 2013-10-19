// utils
var execWrapFile = require.resolve("../../lib/exec-wrap");
var tracker = require("../../lib/tracker");
var find = require('../../lib/array-find');
var wipeMongo = require('../../lib/wipeMongo');
var deepEqual = require('deep-equal');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// config
var config = require('../../config.json');
var dbString = config.dbString;

var expectedSchema = {
  name: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    default: 0
  }
};

var personSchema = new Schema(expectedSchema);

var expectedPerson = {
  name: "Officer Bungus",
  score: 151
};

var expectedQuery = {
  name: expectedPerson.name
};

var verify = function (cb) {
  // VERIFY MONGOOSE
  var data = tracker.get("mongoose");
  // make sure they called createConnection
  var connectCall = find(data.calls, function(call){
    return call.fn === "createConnection";
  });
  if (!connectCall) return cb("You didn't call createConnection");
  if (connectCall.args[0] !== dbString) return cb("You didn't connect to the right database");

  // make sure they called new Schema
  var schemaCall = find(data.calls, function(call){
    return call.fn === "Schema";
  });
  if (!schemaCall) return cb("You didn't call new Schema");
  if (!deepEqual(schemaCall.args[0], expectedSchema)) return cb("You didn't create the correct Schema");
  tracker.wipe("mongoose");
  
  // VERIFY MONGOOSE.MODEL
  // make sure they called Model.findOne
  var modelData = tracker.get("mongoose.Model");
  var queryCall = find(modelData.calls, function(call){
    return call.fn === "findOne";
  });
  if (!queryCall) return cb("You didn't call findOne");
  if (!deepEqual(queryCall.args[0], expectedQuery)) return cb("You didn't execute the right query");

  tracker.wipe("mongoose.Model");

  cb();
};

module.exports = function (isRun, cb) {
  var isVerify = !isRun;

  // wipe old logs
  tracker.wipe("mongoose");
  tracker.wipe("mongoose.Model");

  var db = mongoose.createConnection(dbString);
  var Person = db.model('Person', personSchema);
  Person.create(expectedPerson, function(err){
    if (err) return cb(err);
    cb(null, {
      args: [],
      stdin: null,
      long: false,
      execWrap: execWrapFile,
      close: wipeMongo.bind(null, db),
      verify: verify
    });
  });
};

module.exports.async = true;