'use strict';

const EntropyPlugin = require('./entropy');

module.exports = new EntropyPlugin({
  ruleName: 'Long High-Entropy String',
  percentile: '99.9',
  minLength: 32,
  maxLength: 256
});
