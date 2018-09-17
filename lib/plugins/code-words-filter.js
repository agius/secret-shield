'use strict';

const path = require('path');
const fs = require('fs');

const BulkFilter = require('./bulk-filter');

const filePath = path.resolve(__dirname, 'code-words.json');
const loaded = fs.readFileSync(filePath).toString();
const strings = JSON.parse(loaded);

module.exports = new BulkFilter({
  ruleName: 'Code Words Filter',
  strings: strings
});
