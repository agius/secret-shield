'use strict';

const path = require('path');
const tape = require('tape');

const CFF = require('../../../lib/plugins/common-files-filter');

function MockFile(filePath) {
  this.path = filePath;
}

MockFile.prototype.getExt = function getExt() {
  return path.extname(this.path) || path.basename(this.path);
};

function filter(filePath) {
  return CFF.fileFilter(new MockFile(filePath));
}

tape('[common-files-filter] filters out common directories', (t) => {
  t.ok(filter('/home/app/.git/ignore-this'), 'filters files in .git/ dirs');
  t.ok(filter('/home/app/node_modules/timecube'), 'filters node_modules/');
  t.ok(filter('/home/app/.vscode/cache-with-passwords'), 'filters .vscode/');
  t.ok(filter('/home/app/vendor/someone-elses-pw'), 'filters /vendor/');
  t.end();
});

tape('[common-files-filter] filters out common filenames', (t) => {
  t.ok(filter('/home/app/jQuErY-1.2.4.min.js'), 'filters jQuery crud');
  t.ok(filter('/home/app/package-lock.json'), 'filters package-lock');
  t.ok(filter('/home/app/Podfile.lock'), 'filters Podfile lock');
  t.end();
});

tape('[common-files-filter] filters out non-text extensions', (t) => {
  t.ok(filter('/home/app/big-logo.png'), 'filters png');
  t.ok(filter('/home/app/license-unread.pdf'), 'filters pdf');
  t.ok(filter('/home/app/.DS_Store'), 'filters macOS info');
  t.end();
});
