'use strict';

const fs = require('fs');
const readline = require('readline');

const Finding = require('./finding');

function Shield(config) {
  this.config = config || {};
  this.plugins = [];
}

Shield.prototype.addPlugin = function addPlugin(plugin) {
  this.plugins.push(plugin);
};

Shield.prototype.preprocessString = function preprocessString(input) {
  return this.plugins.reduce((str, plug) => {
    if(!plug.preprocessString) return str;
    return plug.preprocessString(str);
  }, input);
};

Shield.prototype.processString = function processString(input) {
  return this.plugins.reduce((findings, plug) => {
    if(!plug.processString) return findings;
    const found = plug.processString(input);
    return found ? findings.concat(found) : findings;
  }, []);
};

Shield.prototype.processFile = function processFile(filepath) {
  return new Promise((resolve, reject) => {
    const findings = [];
    const filestream = fs.createReadStream(filepath);
    const rl = readline.createInterface({
      input: filestream
    });

    rl.on('line', (line) => {
      const processed = this.preprocessString(line);
      const results = this.processString(processed);
      for(const finding of results) {
        findings.push(finding);
      }
    });

    rl.on('close', () => {
      return resolve(findings);
    });

    filestream.on('error', (err) => {
      return reject(err);
    });
  });
};

Shield.Finding = Finding;

module.exports = Shield;
