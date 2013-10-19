// utils
var execWrapFile = require.resolve("../../lib/exec-wrap");
var tracker = require("../../lib/tracker");
var find = require('../../lib/array-find');
var wipeMongo = require('../../lib/wipeMongo');
var mongoose = require('mongoose');

// config
var config = require('../../config.json');
var dbString = config.dbString;

var verify = function (cb) {
  var data = tracker.get("mongoose");

  // make sure they called createConnection
  var connectCall = find(data.calls, function(call){
    return call.fn === "createConnection";
  });
  if (!connectCall) return cb("You didn't call createConnection");
  if (connectCall.args[0] !== dbString) return cb("You didn't connect to the right database");

  tracker.wipe("mongoose");
  cb();
};

module.exports = function (isRun, cb) {
  var isVerify = !isRun;

  // wipe old logs
  tracker.wipe("mongoose");

  var db = mongoose.createConnection(dbString);

  cb(null, {
    args: [],
    stdin: null,
    long: false,
    execWrap: execWrapFile,
    close: wipeMongo.bind(null, db),
    verify: verify,
    wait: 3000
  });
};

module.exports.async = true;