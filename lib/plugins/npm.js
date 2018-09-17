'use strict';

const RegexPlugin = require('./regex');

function NpmPlugin(options) {
  options = options || {};
  this.npmTokenPlugin = new RegexPlugin({
    ruleName: 'NPM Token',
    pattern: /(?:^|[^a-zA-Z0-9-])([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:$|[^a-zA-Z0-9-])/,
    minEntropy: options.minEntropy || 3.327
  });

  this.npmrcTokenPlugin = new RegexPlugin({
    ruleName: '.npmrc Token',
    pattern: /\/\/registry\.npmjs\.org\/:_authToken=([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i
  });
}

NpmPlugin.prototype.processString = function processString(input) {
  return this.npmTokenPlugin.processString(input) ||
    this.npmrcTokenPlugin.processString(input);
};

module.exports = NpmPlugin;
