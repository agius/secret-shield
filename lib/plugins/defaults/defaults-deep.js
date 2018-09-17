'use strict';

const DefaultsMinimal = require('./defaults-minimal');
const DoNotCommitPlugin = require('../do-not-commit');

const plugins = [
  DefaultsMinimal,
  DoNotCommitPlugin
];
function DefaultsDeep(shield) {

  for(const plugin of plugins) {
    shield.loadPlugin(plugin);
  }
};

module.exports.plugins = plugins;
