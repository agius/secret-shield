'use strict';

const path = require('path');
const fs = require('fs');

const RegexRule = require(path.resolve(__dirname, 'rules', 'regex-rule'));
const RegexRemove = require(path.resolve(__dirname, 'preprocessors', 'regex-remove'));
const StringsRemove = require(path.resolve(__dirname, 'preprocessors', 'strings-remove'));
const LengthExclude = require(path.resolve(__dirname, 'preprocessors', 'length-exclude'));

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
};

Shield.prototype.loadConfigFile = function loadConfigFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if(err) return reject(err);

      const config = JSON.parse(data.toString());

      for(const pp in config.preprocess) {
        if(!config.preprocess.hasOwnProperty(pp)) continue;
        this.preprocessors.push(this.loadPreprocessor(config.preprocess[pp]));
      }

      for(const ruleName in config.regex) {
        if(!config.regex.hasOwnProperty(ruleName)) continue;
        this.rules.push(new RegexRule(ruleName, config.regex[ruleName]));
      }

      return resolve(this);
    });
  });
};

Shield.prototype.loadPreprocessor = function loadPreprocessor(config) {
  switch(config.type) {
    case 'remove':
      return new RegexRemove(config);
      break;
    case 'bulkIgnore':
      if(!config.strings && config.path) {
        const filePath = path.resolve(__dirname, '..', config.path);
        const loaded = fs.readFileSync(filePath).toString();
        config.strings = config.strings || JSON.parse(loaded);
      }
      return new StringsRemove(config);
      break;
    case 'exclude':
      return new LengthExclude(config);
    default:
      throw new Error('Invalid preprocessor type: ' + config.type);
  }
};

Shield.prototype.processString = function processString(input) {
  const findings = [];

  for(const i in this.preprocessors) {
    input = this.preprocessors[i].process(input);
  }

  for(const rule of this.rules) {
    const finding = rule.process(input);
    if(finding) findings.push(finding);
  }

  return findings;
};

module.exports = Shield;
