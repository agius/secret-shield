'use strict';

const fuzzy = require('fast-fuzzy');

function FuzzyMatchRule(ruleName, config) {
  this.ruleName = ruleName;
  this.caseSensitive = config.caseSensitive;
  if(this.caseSensitive) {
    this.phrases = [];
    for(const phrase of config.phrases) this.phrases.push(phrase.toLowerCase());
  } else {
    this.phrases = config.phrases;
  }

  this.threshold = config.threshold;
}

FuzzyMatchRule.prototype.process = function process(input) {
  if(this.caseSensitive) {
    input = input.toLowerCase();
  }

  for(const phrase of this.phrases) {
    if(fuzzy.fuzzy(phrase, input) > this.threshold) {
      return { ruleName: this.ruleName, match: input};
    }
  }
};

module.exports = FuzzyMatchRule;
