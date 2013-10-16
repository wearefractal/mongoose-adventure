var startMongo = require('../../lib/startMongo');

module.exports = function (run) {
  var verify = !run;

  var mongo = startMongo(9001);
  var serverInfo = "mongodb://localhost:9001/workshop";

  return {
    args: [serverInfo],
    close: mongo.close
  };
};