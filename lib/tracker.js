var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf').sync;
var ton = require('ton');

var trackingFolder = path.join(__dirname, '../tracking');

// set up ton types
ton.add('Buffer', function(v){
  if (Buffer.isBuffer(v)) return '<Buffer>';
});

ton.add('String', function(v){
  if (v === String) return 'String';
});

ton.add('Number', function(v){
  if (v === Number) return 'Number';
});

ton.add('Boolean', function(v){
  if (v === Boolean) return 'Boolean';
});

ton.add('Date', function(v){
  if (v === Date) return 'Date';
});

var us = {};
us.tracking = {};

us.logFile = function(name) {
  // fix bad chars
  var uniq = new Buffer(name).toString('base64');
  return path.join(trackingFolder, uniq+'-calls.json');
};

us.track = function(name, obj, keys) {
  us.clearCalls(name);
  if (!keys) keys = Object.keys(obj);
  keys.forEach(function(k){
    if (typeof obj[k] !== 'function') return;
    obj[k] = createReplacement(name, k, obj[k]);
  });
  return us;
};

us.get = function(name) {
  var content = fs.readFileSync(us.logFile(name));
  return ton.parse(content);
};

us.wipe = function(name) {
  us.clearCalls(name);
  rimraf(us.logFile(name));
  return us;
};

us.writeCalls = function(name) {
  fs.writeFileSync(us.logFile(name), ton.stringify(us.tracking[name]));
  return us;
};

us.clearCalls = function(name) {
  us.tracking[name] = {
    required: [],
    calls: []
  };
  return us;
};

function createReplacement(name, fnName, fn) {
  var oldStack = Error.prepareStackTrace;
  var replacement = function() {
    var err, stack;

    try {
      err = new Error();
      Error.prepareStackTrace = function (err, stack) {
        return stack;
      };
      Error.captureStackTrace(err, replacement);
      stack = err.stack.map(formatStackFrame);
      Error.prepareStackTrace = oldStack;
    } catch (e) {}

    var args = Array.prototype.slice.call(arguments);
    us.tracking[name].calls.push(formatCall(fnName, args, stack));
    us.tracking[name].required = Object.keys(require.cache);
    us.writeCalls(name);
    return fn.apply(this, arguments);
  };
  return replacement;
}

function formatCall(fn, args, stack) {
  return {
    fn: fn,
    args: args,
    stack: stack
  };
};

function formatStackFrame(frame) {
  return {
    type: frame.getTypeName(),
    fn: frame.getFunctionName(),
    method: frame.getMethodName(),
    file: frame.getFileName(),
    line: frame.getLineNumber(),
    col: frame.getColumnNumber(),
    global: frame.isToplevel(),
    native: frame.isNative(),
    ctor: frame.isConstructor()
  };
}

module.exports = us;