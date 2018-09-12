'use strict';

const path = require('path');
const fs = require('fs');

const thresholdPath = path.resolve(__dirname, '..', '..', 'config', 'tables', 'entropy100000.json');
const thresholds = JSON.parse(fs.readFileSync(thresholdPath).toString());

const ztable = {
  '95': 1.645,
  '99': 2.326,
  '99.5': 2.576,
  '99.9': 3.090,
  '99.95': 3.291
};

const matchTypeRules = [
  [/^[A-Z]+$/, 'alpha'],
  [/^[a-z]+$/, 'alpha'],
  [/^[a-zA-Z]+$/, 'alphaCase'],
  [/^[0-9A-F]+$/, 'hex'],
  [/^[0-9a-f]+$/, 'hex'],
  [/^[0-9A-Z]+$/, 'alphaNum'],
  [/^[0-9a-z]+$/, 'alphaNum']
];

function EntropyRule(ruleName, config) {
  this.ruleName = ruleName;
  this.percentile = ztable[config.percentile];
  this.minLength = config.minLength;
  this.maxLength = config.maxLength;
  this.regex = new RegExp('\\b[0-9a-zA-Z]{' + this.minLength + ',' + this.maxLength + '}\\b', 'g');
  this.isDisabled = config.disabled || config.isDisabled;
}

/**
 * Calculate Shannon's entropy for a string
 */
EntropyRule.prototype.entropy = function entropy(input) {
  const set = {};

  input.split('').forEach(
    /* eslint no-return-assign: "off" */
    c => (set[c] ? set[c]++ : (set[c] = 1))
  );

  return Object.keys(set).reduce((acc, c) => {
    const p = set[c] / input.length;
    return acc - (p * (Math.log(p) / Math.log(2)));
  }, 0);
};

EntropyRule.prototype.threshold = function threshold(kind, len) {
  const kindInfo = thresholds[kind];
  if(!kindInfo) return Infinity;

  const lengthInfo = kindInfo[len.toString()];
  if(!lengthInfo || !lengthInfo.mean || !lengthInfo.stdev) return Infinity;

  return lengthInfo.mean - (this.percentile * lengthInfo.stdev);
};

EntropyRule.prototype.matchType = function matchType(input) {
  for(const rule of matchTypeRules) {
    if(rule[0].test(input)) return rule[1];
  }
  return 'alphaNumCase';
};

EntropyRule.prototype.checkCandidate = function checkCandidate(candidate) {
  const kind = this.matchType(candidate);
  const thresh = this.threshold(kind, candidate.length);
  const ent = this.entropy(candidate);

  return ent >= thresh;
};

EntropyRule.prototype.process = function process(input) {
  if(this.isDisabled) return;

  const candidates = input.match(this.regex);
  if (candidates === null) return;

  for (const candidate of candidates) {
    if(this.checkCandidate(candidate)) {
      return { ruleName: this.ruleName, match: candidate };
    }
  }
};

module.exports = EntropyRule;
