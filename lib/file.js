'use strict';

const path = require('path');

function File(options) {
  options = options || {};
  this.path = options.path;
  Object.assign(this, path.parse(this.path), options.stats);
}

File.prototype.getExt = function getExt() {
  return this.ext || this.base;
};

module.exports = File;
