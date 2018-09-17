'use strict';

const util = require('util');

const FuzzyMatchPlugin = require('./fuzzy-match');

function DoNotCommitPlugin(options) {
  options = options || {};
  options.ruleName = 'Do Not Commit';
  options.phrases = [
    "don't commit",
    'do not commit',
    'remove before committing'
  ];
  options.threshold = options.threshold || 0.85;
  FuzzyMatchPlugin.call(this, options);
};

util.inherits(DoNotCommitPlugin, FuzzyMatchPlugin);

module.exports = DoNotCommitPlugin;
