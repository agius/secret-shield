'use strict';

function BulkFilter(options) {
  this.ruleName = options.ruleName;
  this.replacement = options.replacement || '';
  this.caseSensitive = options.caseSensitive;
  if(!this.caseSensitive) {
    this.strings = options.strings.map(s => s.toLowerCase());
  } else {
    this.strings = options.strings;
  }
}

BulkFilter.prototype.preprocessString = function preprocessString(input) {
  if(!this.caseSensitive) input = input.toLowerCase();
  for(const str of this.strings) {
    let substringStart = input.indexOf(str);
    let substringEnd = null;
    while(substringStart !== -1) {
      substringEnd = substringStart + str.length;
      input = input.slice(0, substringStart) + this.replacement + input.slice(substringEnd);
      substringStart = input.indexOf(str);
    }
  }
  return input;
};

module.exports = BulkFilter;
