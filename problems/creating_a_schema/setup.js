// utils
var execWrapFile = require.resolve("../../lib/exec-wrap");
var tracker = require("../../lib/tracker");
var startMongo = require('../../lib/start-mongo');
var find = require('../../lib/array-find');
var deepEqual = require('deep-equal');

// config
var path = require('path');
var dbroot = path.join(__dirname, '../../db');
var dbString = "mongodb://localhost:9001/workshop";

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

var verify = function (cb) {
  var data = tracker.get("mongoose");

  // make sure they called createConnection
  var connectCall = find(data.calls, function(call){
    return call.fn === "createConnection" && call.args[0] === dbString;
  });
  if (!connectCall) return cb("You either didn't call createConnection or you called it with the wrong arguments");
  
  // make sure they called Schema
  var schemaCall = find(data.calls, function(call){
    console.log(call.fn, call.args);
    return call.fn === "Schema" && deepEqual(call.args[0], expectedSchema);
  });
  if (!schemaCall) return cb("You either didn't call Schema or you called it with the wrong arguments");

  tracker.wipe("mongoose");
  cb();
};
module.exports = function (isRun, cb) {
  var isVerify = !isRun;

  // wipe old logs
  tracker.wipe("mongoose");

  var mongo = startMongo(dbroot, 9001);
  mongo.once('error', cb);
  mongo.once('ready', function(){
    cb(null, {
      args: [],
      stdin: null,
      long: false,
      execWrap: execWrapFile,
      close: mongo.close,
      verify: verify
    });
  });
};

module.exports.async = true;