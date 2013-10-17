var path = require('path');
var dbroot = path.join(__dirname, '../../db');

var startMongo = require('../../lib/startMongo');

var verify = function (cb, env) {
  console.log(this, env);
  cb();
};

module.exports = function (isRun, cb) {
  var isVerify = !isRun;

  var mongo = startMongo(dbroot, 9001);

  return {
    args: [],
    stdin: null,
    long: false,
    close: mongo.close,
    verify: verify
  };
};