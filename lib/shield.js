'use strict';

const path = require('path');
const fs = require('fs');

const configDefaults = {
  precommit: './plugins/defaults/defaults-minimal',
  minimal: './plugins/defaults/defaults-minimal',
  deep: './plugins/defaults/defaults-deep',
  verydeep: './plugins/defaults/defaults-very-deep'
};

function Shield(config) {
  this.configuration = config || {};
  this.plugins = [];
  this.preprocessors = [];
  this.rules = [];
  this.postprocessors = [];
}

Shield.prototype.configure = function configure(options) {
  options = options || 'deep';
  if(typeof options === 'string') {
    const defaultPlugin = require(configDefaults[options]);
    return Promise.resolve(this).then(() => {
      this.addPlugin(defaultPlugin);
    });
  }
  return Promise.resolve(this);
};

Shield.prototype.addPlugin = function addPlugin(plugin) {
  this.plugins.push(plugin);
};

Shield.prototype.preprocessString = function preprocessString(input) {
  return this.plugins.reduce((str, plug) => {
    if(!plug.preprocessString) return str;
    return plug.preprocessString(str);
  }, input);
};

Shield.prototype.processString = function processString(input) {
  return this.plugins.reduce((findings, plug) => {
    if(!plug.processString) return findings;
    const found = plug.processString(input);
    return found ? findings.concat(found) : findings;
  }, []);
};

module.exports = Shield;
