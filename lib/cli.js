'use strict';

const path = require('path');
const fs = require('fs');

const program = require('commander');

const Shield = require('./shield');
const DefaultConfig = require('./default-configs');

const pkgPath = path.resolve(__dirname, '..', 'package.json');
const pkgContents = fs.readFileSync(pkgPath).toString();
const packageJson = JSON.parse(pkgContents);

program.version(packageJson.version)
  .option('-s --string <string>', 'Scan a single string')
  .option('-f --file <file>', 'Scan a file')
  .option('-d --directory <directory>', 'Scan a directory')
  .option('-C --config <precommit|minimal|deep|verydeep>', 'Set rules to use', 'deep')
  .option('-r --repo <gitpath>', 'Clone a repo and scan it');

function CLI(argv) {
  this.program = program.parse(argv);
  this.shield = new Shield();
  this.config = new DefaultConfig(program.config);
  for(const plug of this.config.getPlugins()) {
    this.shield.addPlugin(plug);
  }
}

CLI.prototype.run = function run(){
  if(this.program.string) {
    const preprocessed = this.shield.preprocessString(this.program.string);
    const findings = this.shield.processString(preprocessed);
    if(findings && findings.length > 0) return this.handleFindings(findings);
    return this.handleSuccess();
  }

  if(this.program.file) {
    const fpath = path.resolve(this.program.file);
    return this.shield.processFile(fpath).then((findings) => {
      if(findings && findings.length > 0) return this.handleFindings(findings);
      return this.handleSuccess();
    }).catch((err) => {
      return this.handleError(err);
    });
  }

  if(this.program.directory) {
    const dirpath = path.resolve(this.program.directory);
    return this.shield.processDirectory(dirpath).then((findings) => {
      if(findings && findings.length > 0) return this.handleFindings(findings);
      return this.handleSuccess();
    }).catch((err) => {
      return this.handleError(err);
    });
  }

  if(this.program.repo) {
    return this.shield.processRemoteRepo(this.program.repo).then((findings) => {
      if(findings && findings.length > 0) return this.handleFindings(findings);
      return this.handleSuccess();
    }).catch((err) => {
      return this.handleError(err);
    });
  }
};

CLI.prototype.handleSuccess = function handleSuccess() {
  console.log('No secrets found!');
};

CLI.prototype.handleFindings = function handleFindings(findings) {
  for(const finding of findings) {
    console.error(finding.toString());
  }
  process.exit(1);
};

CLI.prototype.handleError = function handleError(err) {
  console.error(err);
  process.exit(1);
};

CLI.program = program;

module.exports = CLI;
