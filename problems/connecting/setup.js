var path = require('path');
var dbroot = path.join(__dirname, '../../db');

var startMongo = require('../../lib/startMongo');

var verify = function (cb) {
  cb();
};

module.exports = function (isRun) {
  var isVerify = !isRun;

  var mongo = startMongo(dbroot, 9001);

  return {
    args: [],
    stdin: null,
    long: true,
    close: mongo.close,
    verify: verify
  };
};