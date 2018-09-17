'use strict';

const util = require('util');

const RegexPlugin = require('./regex');

function GithubPlugin(options) {
  options = options || {};
  options.ruleName = 'Github Token';
  options.pattern = /\b([0-9a-z]{40})\b/i;
  options.minEntropy = options.minEntropy || 3.5;
  RegexPlugin.call(this, options);
}

util.inherits(GithubPlugin, RegexPlugin);

module.exports = GithubPlugin;
