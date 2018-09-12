'use strict';

function RegexRule(ruleName, config) {
  this.ruleName = ruleName;
  this.pattern = new RegExp(config.pattern.replace(/\\\\/, '\\'), 'gm');
  this.minEntropy = config.minEntropy;
  this.isDisabled = config.disabled;
}

RegexRule.prototype.process = function process(input) {
  if(this.isDisabled) return;
  const match = input.toString().match(this.pattern);
  if(match === null || match.length <= 0) return;

  return { ruleName: this.ruleName, match: match };
};

module.exports = RegexRule;
