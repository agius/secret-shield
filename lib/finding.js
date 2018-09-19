'use strict';

function Finding(options) {
  options = options || {};
  this.ruleName = options.ruleName;
  this.match = options.match;
  this.secret = options.secret;
  this.redact = options.redact;
  this.file = options.file;
  this.redactedLength = options.redactedLength || 4;
  this.foundAt = new Date();
}

Finding.prototype.setFile = function setFile(filepath) {
  this.file = filepath;
};

Finding.prototype.setLine = function setLine(lineNo) {
  this.line = lineNo;
};

Finding.prototype.redactString = function redactString(str, len) {
  const origLength = str.length;
  const remaining = Buffer.alloc(origLength - len, '*').toString();
  return str.substring(0, len) + remaining;
};

Finding.prototype.toPrint = function toPrint(options) {
  options = options || {};

  const msg = [
    this.foundAt.toISOString(),
    'shield:finding',
    'rule="' + this.ruleName + '"'
  ];

  if(this.file) {
    let fileStr = 'file="' + this.file;
    if(this.line) fileStr = fileStr + ':' + this.line;
    fileStr = fileStr + '"';
    msg.push(fileStr);
  }

  const redact = options.redact || this.redact;
  const redactedLength = options.redactedLength || this.redactedLength || 0;

  const matchString = Array.isArray(this.match) ?
    (this.match[1] || this.match[0] || '\'No match specified\'') :
    this.match;

  if(redact && redactedLength > 0) {
    msg.push('secret="' + this.redactString(matchString, redactedLength) + '"');
  } else {
    msg.push('secret="' + matchString + '"');
  }

  return msg.join(' ');
};

Finding.prototype.toString = function toString() {
  return this.toPrint();
};

module.exports = Finding;
