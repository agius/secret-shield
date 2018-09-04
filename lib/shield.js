'use strict';

const path = require('path');
const fs = require('fs');

const RegexRule = require(path.resolve(__dirname, 'rules', 'regex-rule'));

function Shield() {
  this.preprocessors = [];
  this.rules = [];
  this.postprocessors = [];
  this.findings = [];
}

Shield.prototype.configure = function configure(options) {
  options = options || path.resolve(__dirname, '..', 'config', 'rules', 'deep.json');
  if(typeof options === 'string') {
    return this.loadConfigFile(options);
  }
  return Promise.resolve(this);
}

Shield.prototype.loadConfigFile = function(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if(err) return reject(err);

      const config = JSON.parse(data.toString());

      for(const ruleName in config.regex) {
        if(!config.regex.hasOwnProperty(ruleName)) continue;
        this.rules.push(new RegexRule(ruleName, config.regex[ruleName]));
      }

      return resolve(this);
    });
  });
}

Shield.prototype.processString = function processString(input) {
  const findings = [];

  for(const rule of this.rules) {
    const finding = rule.process(input);
    if(finding) findings.push(finding);
  }

  return findings;
}

module.exports = Shield;
