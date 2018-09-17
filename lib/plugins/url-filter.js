'use strict';

const RegexFilterPlugin = require('./regex-filter');

module.exports = new RegexFilterPlugin({
  pluginName: 'URL Filter',
  pattern: /(https?|ftp):\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,11}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
});
