#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('fs');

const program = require('commander');

const Shield = require(path.resolve(__dirname, '..', 'lib', 'shield'));

const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'package.json')).toString());

program.version(packageJson.version)
  .option('-s --string <string>', 'Scan a single string')
  .parse(process.argv);

const shield = new Shield(program);

shield.configure().then(() => {
  return shield.processString(program.string);
}).then((findings) => {
  if(findings.length > 0) {
    for(const finding of findings) {
      console.error('Found possible secret: ' + finding.match);
    }
    process.exit(1);
  }
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
