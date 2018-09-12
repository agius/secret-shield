'use strict';

function LengthExclude(config) {
  this.ruleName = config.name;
  this.minLength = config.minLength;
  this.maxLength = config.maxLength;
  this.breakString = config.disallowedString || config.breakString;
  this.replacement = config.replacement || '';
}

LengthExclude.prototype.process = function process(input) {
  if(input.indexOf(this.breakString) !== -1) return input;
  if(this.minLength && input.length < this.minLength) return '';
  if(this.maxLength && input.length > this.maxLength) return '';
  return input;
};

module.exports = LengthExclude;
