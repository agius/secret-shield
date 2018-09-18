'use strict';

const fuzzy = require('fast-fuzzy');

const Finding = require('../finding');

function FuzzyMatchPlugin(options) {
  this.ruleName = options.ruleName || 'Fuzzy Match';
  this.caseSensitive = options.caseSensitive;
  if(this.caseSensitive) {
    this.phrases = options.phrases;
  } else {
    this.phrases = options.phrases.map(p => p.toLowerCase());
  }

  this.threshold = options.threshold;
}

FuzzyMatchPlugin.prototype.processString = function processString(input) {
  if(!this.caseSensitive) {
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
