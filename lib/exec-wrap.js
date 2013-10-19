var tracker = require('./tracker');
var mongoose = require('mongoose');

var watching = ['createConnection', 'Schema'];
var modelWatching = ['findOne'];

module.exports = {
  init: function(){
    tracker.track('mongoose', mongoose.__proto__, watching);
    tracker.track('mongoose.Model', mongoose.Model, modelWatching);
  }
};