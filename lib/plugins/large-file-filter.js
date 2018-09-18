'use strict';

function LargeFileFilter(options) {
  options = options || {};
  this.maxFileSize = options.maxFileSize;
}

LargeFileFilter.prototype.fileFilter = function fileFilter(file) {
  if(file.size > this.maxFileSize) return true;
  return false;
};

module.exports = LargeFileFilter;
