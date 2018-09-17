'use strict';

function Finding(options) {
  options = options || {};
  this.ruleName = options.ruleName;
  this.match = options.match;
  this.redact = options.redact;
  this.redactedLength = options.redactedLength || 4;
}

Finding.prototype.toPrint = function toPrint(options) {
  options = options || {};
  const redact = options.redact || this.redact;
  const redactedLength = options.redactedLength || this.redactedLength || 0;

  let matchString = this.match;
  if(Array.isArray(matchString)) matchString = matchString[1] || matchString[0];
  if(redact && redactedLength > 0) {
    const origLength = matchString.length;
    matchString = matchString.substring(0, this.redactedLength).padEnd(origLength, '*');
  }
  return [
    'Finding | Rule Name:',
    this.ruleName,
    '| Matched Text: ',
    matchString
  ].join(' ');
};

Finding.prototype.toString = function toString() {
  return this.toPrint();
};

module.exports = Finding;
