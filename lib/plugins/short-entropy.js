'use strict';

const EntropyPlugin = require('./entropy');

module.exports = new EntropyPlugin({
  percentile: '99',
  minLength: 16,
  maxLength: 31
});
