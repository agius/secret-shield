'use strict';

const util = require('util');

const RegexPlugin = require('./regex');

function Base64HighEntropyPlugin(options) {
  options = options || {};
  options.ruleName = 'Base64 High-Entropy String';
  options.pattern = /([a-zA-Z0-9+/]{80,512}={1,2})/;
  options.minEntropy = options.minEntropy || 4.033;
  RegexPlugin.call(this, options);
}

util.inherits(Base64HighEntropyPlugin, RegexPlugin);

module.exports = Base64HighEntropyPlugin;
