var child_process = require('child_process');

module.exports = function(port){
  if (!port) throw new Error("Missing port argument");
  var proc = child_process.spawn('mongod', ['--port',port]);
  return {
    close: proc.kill.bind(proc, 'SIGINT')
  };
};