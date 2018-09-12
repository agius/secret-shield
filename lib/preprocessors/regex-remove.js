'use strict';

function RegexRemove(config) {
  this.ruleName = config.name;
  this.pattern = new RegExp(config.pattern.replace(/\\\\/, '\\'), 'g');
  this.replacement = config.replacement || '\n';
}

RegexRemove.prototype.process = function process(input) {
  return input.replace(this.pattern, this.replacement);
};

module.exports = RegexRemove;
