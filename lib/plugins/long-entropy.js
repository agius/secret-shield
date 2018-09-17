'use strict';

const EntropyPlugin = require('./entropy');

module.exports = new EntropyPlugin({
  percentile: '99.9',
  minLength: 32,
  maxLength: 256
});
