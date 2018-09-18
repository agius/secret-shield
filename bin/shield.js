#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('fs');

const program = require('commander');

const Shield = require(path.resolve(__dirname, '..', 'lib', 'shield'));
const DefaultConfig = require(path.resolve(__dirname, '..', 'lib', 'default-configs'));

const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'package.json')).toString());

program.version(packageJson.version)
  .option('-s --string <string>', 'Scan a single string')
  .option('-f --file <filePath>', 'Scan a file')
  .option('-d --directory <directory>', 'Scan a directory')
  .option('-r --ruleset <rules>', 'Set rules to use', 'deep')
  .parse(process.argv);

const shield = new Shield(program);
const config = new DefaultConfig(program);
const plugs = config.getPlugins(program.rules);
for(const plug of plugs) {
  shield.addPlugin(plug);
}

if(program.string) {
  const preprocessed = shield.preprocessString(program.string);
  const findings = shield.processString(preprocessed);

  if(findings.length > 0) {
    for(const finding of findings) {
      console.error(finding.toString());
    }
    process.exit(1);
  } else {
    console.log('No secrets found!');
  }
}

if(program.file) {
  const filePath = path.resolve(program.file);
  shield.processFile(filePath).then((findings) => {
    if(findings.length > 0) {
      for(const finding of findings) {
        console.error(finding.toString());
      }
      process.exit(1);
    } else {
      console.log('No secrets found!');
    }
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

if(program.directory) {
  const dirpath = path.resolve(program.directory);
  shield.processDirectory(dirpath).then((findings) => {
    if(findings.length > 0) {
      for(const finding of findings) {
        console.error(finding.toString());
      }
      process.exit(1);
    } else {
      console.log('No secrets found!');
    }
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
