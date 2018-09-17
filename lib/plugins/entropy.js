'use strict';

const path = require('path');
const fs = require('fs');

const Finding = require('../finding');
const entropic = require('../entropic');

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

function EntropyPlugin(options) {
  options = options || {};
  this.ruleName = options.ruleName;
  this.percentile = ztable[options.percentile];
  this.minLength = options.minLength;
  this.maxLength = options.maxLength;
  this.regex = new RegExp('\\b[0-9a-zA-Z]{' + this.minLength + ',' + this.maxLength + '}\\b', 'g');
}

EntropyPlugin.prototype.threshold = function threshold(kind, len) {
  const kindInfo = thresholds[kind];
  if(!kindInfo) return Infinity;

  const lengthInfo = kindInfo[len.toString()];
  if(!lengthInfo || !lengthInfo.mean || !lengthInfo.stdev) return Infinity;

  return lengthInfo.mean - (this.percentile * lengthInfo.stdev);
};

EntropyPlugin.prototype.matchType = function matchType(input) {
  for(const rule of matchTypeRules) {
    if(rule[0].test(input)) return rule[1];
  }
  return 'alphaNumCase';
};

EntropyPlugin.prototype.checkCandidate = function checkCandidate(candidate) {
  const kind = this.matchType(candidate);
  const thresh = this.threshold(kind, candidate.length);
  const ent = entropic.entropy(candidate);

  return ent >= thresh;
};

EntropyPlugin.prototype.processString = function processString(input) {
  const candidates = input.match(this.regex);
  if (candidates === null) return;

  for (const candidate of candidates) {
    if(this.checkCandidate(candidate)) {
      return new Finding({
        ruleName: this.ruleName,
        match: candidate
      });
    }
  }
};

module.exports = EntropyPlugin;
