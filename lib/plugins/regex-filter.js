'use strict';

function RegexFilterPlugin(options) {
  options = options || {};
  this.pluginName = options.pluginName;
  this.pattern = options.pattern;
}

RegexFilterPlugin.prototype.preprocessString = function preprocessString(input) {
  return input.replace(this.pattern, '');
};

module.exports = RegexFilterPlugin;
