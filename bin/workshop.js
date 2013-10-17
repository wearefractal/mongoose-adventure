#!/usr/bin/env node

var workshopper = require('workshopper');
var path = require('path');

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
  helpFile : path.join(__dirname, '../help.txt')
}).init();