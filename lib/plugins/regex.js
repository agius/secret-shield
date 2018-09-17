'use strict';

const entropic = require('../entropic');
const Finding = require('../finding');

function RegexPlugin(options) {
  this.pattern = options.pattern;
  this.minEntropy = options.minEntropy;
  this.ruleName = options.ruleName || 'Regex Rule: ' + this.pattern;
}

RegexPlugin.prototype.processString = function processString(input) {
  const match = input.toString().match(this.pattern);
  if(match === null || match.length <= 0) return;

  if(this.minEntropy && entropic.entropy(match[1]) < this.minEntropy) return;

  return new Finding({
    ruleName: this.ruleName,
    match: match
  });
};

module.exports = RegexPlugin;
