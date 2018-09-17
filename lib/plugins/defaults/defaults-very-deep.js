'use strict';

const DefaultsDeep = require('./defaults-deep');
const Base64HighEntropyPlugin = require('../base64-high-entropy');
const ShortHighEntropyPlugin = require('../short-high-entropy-plugin');
const LongHighEntropyPlugin = require('../long-high-entropy-plugin');

module.exports = function DefaultsVeryDeep(shield) {
  this.plugins = [
    DefaultsDeep,
    Base64HighEntropyPlugin,
    ShortHighEntropyPlugin,
    LongHighEntropyPlugin
  ];

  for(const plugin of this.plugins) {
    shield.loadPlugin(plugin);
  }
};
