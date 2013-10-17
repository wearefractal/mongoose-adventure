var path = require('path');
var fs = require('fs');

var rimraf = require('rimraf').sync;
var child_process = require('child_process');

module.exports = function(root, port){
  if (!port) throw new Error("Missing port argument");

  var datapath = path.join(root, 'data');
  var pidpath = path.join(root, 'db.pid');
  var logpath = path.join(root, 'db.log');

  if (fs.existsSync(root)) rimraf(root);

  fs.mkdirSync(root);
  fs.mkdirSync(datapath);

  var args = [];
  args = args.concat(['--port', port]);
  args = args.concat(['--dbpath', datapath]);
  args = args.concat(['--pidfilepath', pidpath]);
  args = args.concat(['--logpath', logpath]);

  var proc = child_process.spawn('mongod', args);

  proc.stdout.once('data', function(d){
    //console.log('stdout', String(d));
    proc.emit('ready');
  });
  proc.stderr.once('data', function(d){
    //console.log('stderr', String(d));
    proc.emit('error', d);
  });

  proc.close = function(){
    proc.kill('SIGINT');
    rimraf(root);
  };

  return proc;
};