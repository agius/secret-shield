'use strict';

const fuzzy = require('fast-fuzzy');

const Finding = require('../finding');

function FuzzyMatchPlugin(options) {
  this.ruleName = options.ruleName || 'Fuzzy Match';
  this.caseSensitive = options.caseSensitive;
  if(this.caseSensitive) {
    this.phrases = [];
    for(const phrase of options.phrases) this.phrases.push(phrase.toLowerCase());
  } else {
    this.phrases = options.phrases;
  }

  this.threshold = options.threshold;
}

FuzzyMatchPlugin.prototype.processString = function processString(input) {
  if(this.caseSensitive) {
    input = input.toLowerCase();
  }

  for(const phrase of this.phrases) {
    if(fuzzy.fuzzy(phrase, input) > this.threshold) {
      return new Finding({
        ruleName: this.ruleName,
        match: input
      });
    }
  }
};

module.exports = FuzzyMatchPlugin;
