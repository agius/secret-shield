'use strict';

const tape = require('tape');

const CFF = require('../../../lib/plugins/common-files-filter');

tape('[common-files-filter] filters out common directories', (t) => {
  t.ok(CFF.fileFilter('/home/app/.git/ignore-this'), 'filters files in .git/ dirs');
  t.ok(CFF.fileFilter('/home/app/node_modules/timecube'), 'filters node_modules/');
  t.ok(CFF.fileFilter('/home/app/.vscode/cache-with-passwords'), 'filters .vscode/');
  t.ok(CFF.fileFilter('/home/app/vendor/someone-elses-pw'), 'filters /vendor/');
  t.end();
});

tape('[common-files-filter] filters out common filenames', (t) => {
  t.ok(CFF.fileFilter('/home/app/jQuErY-1.2.4.min.js'), 'filters jQuery crud');
  t.ok(CFF.fileFilter('/home/app/package-lock.json'), 'filters package-lock');
  t.ok(CFF.fileFilter('/home/app/Podfile.lock'), 'filters Podfile lock');
  t.end();
});

tape('[common-files-filter] filters out non-text extensions', (t) => {
  t.ok(CFF.fileFilter('/home/app/big-logo.png'), 'filters png');
  t.ok(CFF.fileFilter('/home/app/license-unread.pdf'), 'filters pdf');
  t.ok(CFF.fileFilter('/home/app/.DS_Store'), 'filters macOS info');
  t.end();
});
