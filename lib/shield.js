'use strict';

const fs = require('fs');
const readline = require('readline');

const helpers = require('./helpers');
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
        finding.setFile(filepath);
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

Shield.prototype.filterFiles = function filterFiles(fileObjs) {
  return fileObjs.filter((fo) => {
    for(const plug of this.plugins) {
      if(plug.fileFilter && plug.fileFilter(fo)) return false;
      return true;
    }
  });
};

Shield.prototype.processDirectory = function processDirectory(dirpath) {
  return helpers.recurseDir(dirpath).then((fileObjs) => {
    fileObjs = this.filterFiles(fileObjs);
    // hmm maybe this should be a queue with bounded concurrency
    return Promise.all(fileObjs.map((fo) => {
      return this.processFile(fo.path);
    }));
  }).then((founds) => {
    return helpers.flatten(founds);
  });
};

Shield.Finding = Finding;

module.exports = Shield;
