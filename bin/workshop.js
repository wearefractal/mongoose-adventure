#!/usr/bin/env node

var workshopper = require('workshopper');
var path = require('path');
var startMongo = require('../lib/start-mongo');

var dbroot = path.join(__dirname, '../db');
var config = require('../config.json');

workshopper({
  name: config.name,
  title: config.title,
  subtitle: config.subtitle,
  appDir: path.join(__dirname, '../'),
  menu: {
    bg: config.background,
    fg: config.foreground
  },
  helpFile: path.join(__dirname, '../help.txt'),
  setupFunction: function(name, dir) {
    console.log('Starting MongoDB...');
    startMongo(dbroot, config.mongoPort, function(err) {
      if (err) return console.log('ERROR: ' + err);
      console.log('Started!');
    });
  }
}).init();