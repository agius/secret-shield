'use strict';

const RegexFilter = require('./regex-filter');

module.exports = new RegexFilter({
  pluginName: 'HTMl Element Filter',
  pattern: /\bHTML[a-zA-Z]+Element\b/
});
