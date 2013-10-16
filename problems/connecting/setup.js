var startMongo = require('../../lib/startMongo');

module.exports = function (run) {
  var verify = !run;

  var mongo = startMongo(29019);
  var serverInfo = "mongodb://localhost:29019/workshop";

  return {
    args: [serverInfo],
    close: mongo.close
  };
};