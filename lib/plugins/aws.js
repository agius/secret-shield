'use strict';

const path = require('path');
const fs = require('fs');

const RegexPlugin = require('./regex');
const BulkFilter = require('./bulk-filter');

const filePath = path.resolve(__dirname, 'aws', 'aws-false-positives.json');
const loaded = fs.readFileSync(filePath).toString();
const strings = JSON.parse(loaded);

const publicIdRule = new RegexPlugin({
  ruleName: 'AWS Client ID',
  pattern: /\b(AKIA[0-9A-Z]{16})\b/
});

const privateKeyRule = new RegexPlugin({
  ruleName: 'AWS Secret Key',
  pattern: /\b([0-9a-zA-Z/+]{40})\b/,
  minEntropy: 4.365
});

const awsFilter = new BulkFilter({
  ruleName: 'Ignore AWS False Positives',
  strings: strings
});

function preprocessString(input) {
  return awsFilter.preprocessString(input);
}

function processString(input) {
  return publicIdRule.processString(input) ||
    privateKeyRule.processString(input);
}

module.exports = {
  preprocessString: preprocessString,
  processString: processString
};
