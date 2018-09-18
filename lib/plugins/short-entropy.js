'use strict';

const EntropyPlugin = require('./entropy');

module.exports = new EntropyPlugin({
  ruleName: 'Short High-Entropy String',
  percentile: '99',
  minLength: 16,
  maxLength: 31
});
