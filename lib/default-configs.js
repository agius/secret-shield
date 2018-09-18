'use strict';

function DefaultConfig(options) {
  if(typeof options === 'string') {
    this.ruleset = options;
  } else {
    this.ruleset = options.ruleset;
  }
}

DefaultConfig.prototype.getPlugins = function getPlugins() {
  switch (this.ruleset) {
    case 'precommit':
      return this.getPrecommitPlugins();
      break;
    case 'minimal':
      return this.getMinimalPlugins();
      break;
    case 'deep':
      return this.getDeepPlugins();
      break;
    case 'verydeep':
      return this.getVeryDeepPlugins();
      break;
    default:
      return this.getMinimalPlugins();
      break;
  }
};

DefaultConfig.prototype.getCommonPlugins = function getCommonPlugins() {
  const plugs = [];

  plugs.push(require('./plugins/common-files-filter'));
  plugs.push(require('./plugins/url-filter'));
  plugs.push(require('./plugins/html-filter'));
  plugs.push(require('./plugins/camel-filter'));
  plugs.push(require('./plugins/code-words-filter'));
  plugs.push(require('./plugins/english-filter'));
  plugs.push(require('./plugins/long-string-filter'));

  plugs.push(require('./plugins/mapbox'));
  plugs.push(require('./plugins/mapbox'));
  plugs.push(require('./plugins/slack'));

  const NPM = require('./plugins/npm');
  plugs.push(new NPM({minEntropy: 3.327}));

  return plugs;
};

DefaultConfig.prototype.getPrecommitPlugins = function getPrecommitPlugins() {
  const plugs = this.getCommonPlugins();

  const LFF = require('./plugins/large-file-filter');
  plugs.push(new LFF({ maxFileSize: 5e+6}));

  const GH = require('./plugins/github');
  plugs.push(new GH({minEntropy: 4.001}));

  const AWS = require('./plugins/aws');
  plugs.push(new AWS());

  return plugs;
};

DefaultConfig.prototype.getMinimalPlugins = function getMinimalPlugins() {
  const plugs = this.getCommonPlugins();

  const LFF = require('./plugins/large-file-filter');
  plugs.push(new LFF({ maxFileSize: 5e+7 }));

  const GH = require('./plugins/github');
  plugs.push(new GH({minEntropy: 4.001}));

  const AWS = require('./plugins/aws');
  plugs.push(new AWS());

  return plugs;
};

DefaultConfig.prototype.getDeepPlugins = function getDeepPlugins() {
  const plugs = this.getCommonPlugins();

  const DNCPlug = require('./plugins/do-not-commit');
  plugs.push(new DNCPlug());

  const GH = require('./plugins/github');
  plugs.push(new GH({minEntropy: 4.001}));

  const AWS = require('./plugins/aws');
  plugs.push(new AWS({privateKeyRule: true, minEntropy: 4.456}));

  return plugs;
};

DefaultConfig.prototype.getVeryDeepPlugins = function getVeryDeepPlugins() {
  const plugs = this.getCommonPlugins();

  const DNCPlug = require('./plugins/do-not-commit');
  plugs.push(new DNCPlug());

  plugs.push(require('./plugins/short-entropy'));
  plugs.push(require('./plugins/long-entropy'));

  const GH = require('./plugins/github');
  plugs.push(new GH({minEntropy: 3.5}));

  const AWS = require('./plugins/aws');
  plugs.push(new AWS({privateKeyRule: true, minEntropy: 4.365}));

  return plugs;
};

module.exports = DefaultConfig;
