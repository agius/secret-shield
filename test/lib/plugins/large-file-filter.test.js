'use strict';

const tape = require('tape');

const LFF = require('../../../lib/plugins/large-file-filter');

tape('[large-file-filter] filters large files', (t) => {
  const bigFile = {size: 9999999};
  const filter = new LFF({maxFileSize: 50000});
  t.ok(filter.fileFilter(bigFile), 'filters large file');
  t.end();
});

tape('[large-file-filter] ignores smol files', (t) => {
  const bigFile = {size: 49000};
  const filter = new LFF({maxFileSize: 50000});
  t.notOk(filter.fileFilter(bigFile), 'ignores smol file');
  t.end();
});
