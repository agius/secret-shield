'use strict';

function StringsRemove(config) {
  this.ruleName = config.ruleName;
  this.strings = config.strings;
  this.replacement = config.replacement || '\n';
}

StringsRemove.prototype.process = function process(input) {
  for(const j in this.strings) {
    if(!this.strings.hasOwnProperty(j)) continue;
    const str = this.strings[j];
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

module.exports = StringsRemove;
