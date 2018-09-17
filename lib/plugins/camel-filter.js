'use strict';

const RegexFilterPlugin = require('./regex-filter');

module.exports = new RegexFilterPlugin({
  pluginName: 'camelCase Filter',
  pattern: /\b[a-z]{2,}([A-Z][a-z]{2,})+\b/
});
