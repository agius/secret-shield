'use strict';

const path = require('path');
const fs = require('fs');

const RegexPlugin = require('./regex');
const BulkFilter = require('./bulk-filter');

const filePath = path.resolve(__dirname, 'aws', 'aws-false-positives.json');
const loaded = fs.readFileSync(filePath).toString();
const strings = JSON.parse(loaded);

function AWSPlugin(options) {
  options = options || {};

  this.publicIdRule = new RegexPlugin({
    ruleName: 'AWS Client ID',
    pattern: /\b(AKIA[0-9A-Z]{16})\b/
  });

  if(options.privateKeyRule) {
    this.privateKeyRule = new RegexPlugin({
      ruleName: 'AWS Secret Key',
      pattern: /\b([0-9a-zA-Z/+]{40})\b/,
      minEntropy: options.minEntropy || 4.456
    });
  }

  this.preprocessor = new BulkFilter({
    ruleName: 'Ignore AWS False Positives',
    strings: strings
  });
}

AWSPlugin.prototype.preprocessString = function preprocessString(input) {
  return this.preprocessor.preprocessString(input);
};

AWSPlugin.prototype.processString = function processString(input) {
  const publicIdMatch = this.publicIdRule.processString(input);
  if(publicIdMatch) return publicIdMatch;

  if(this.privateKeyRule) {
    const privateKeyMatch = this.privateKeyRule.processString(input);
    if(privateKeyMatch) return privateKeyMatch;
  }
};

module.exports = AWSPlugin;
