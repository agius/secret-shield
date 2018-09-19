'use strict';

const path = require('path');
const fs = require('fs');

const program = require('commander');

const Shield = require('./shield');
const DefaultConfig = require('./default-configs');

function CLI(options) {
  options = options || {};
  this.shield = new Shield();
  this.config = new DefaultConfig(options.config);
  for(const plug of this.config.getPlugins()) {
    this.shield.addPlugin(plug);
  }
}

CLI.prototype.runString = function runString(input) {
  const preprocessed = this.shield.preprocessString(input);
  const findings = this.shield.processString(preprocessed);
  if(findings && findings.length > 0) return this.handleFindings(findings);
  return this.handleSuccess();
};

CLI.prototype.runFile = function runFile(filename) {
  const fpath = path.resolve(filename);
  return this.shield.processFile(fpath).then((findings) => {
    if(findings && findings.length > 0) return this.handleFindings(findings);
    return this.handleSuccess();
  }).catch((err) => {
    return this.handleError(err);
  });
};

CLI.prototype.runDir = function runDir(directory) {
  const dirpath = path.resolve(directory);
  return this.shield.processDirectory(dirpath).then((findings) => {
    if(findings && findings.length > 0) return this.handleFindings(findings);
    return this.handleSuccess();
  }).catch((err) => {
    return this.handleError(err);
  });
};

CLI.prototype.runRepo = function runRepo(repo) {
  return this.shield.processRemoteRepo(repo).then((findings) => {
    if(findings && findings.length > 0) return this.handleFindings(findings);
    return this.handleSuccess();
  }).catch((err) => {
    return this.handleError(err);
  });
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

const pkgPath = path.resolve(__dirname, '..', 'package.json');
const pkgContents = fs.readFileSync(pkgPath).toString();
const packageJson = JSON.parse(pkgContents);

program.version(packageJson.version);

program.command('scan [string]')
  .description('scan a string for secrets')
  .option('-C --config <precommit|minimal|deep|verydeep>', 'Set rules to use', 'deep')
  .action((input, options) => {
    const cli = new CLI(options);
    cli.runString(input);
  });

program.command('file [file]')
  .description('scan a file for secrets')
  .option('-C --config <precommit|minimal|deep|verydeep>', 'Set rules to use', 'deep')
  .action((file, options) => {
    const cli = new CLI(options);
    cli.runFile(file);
  });

program.command('directory [dir]')
  .alias('dir')
  .description('scan all files in a directory for secrets (recursive)')
  .option('-C --config <precommit|minimal|deep|verydeep>', 'Set rules to use', 'deep')
  .action((dir, options) => {
    const cli = new CLI(options);
    cli.runDir(dir);
  });

program.command('repository [repo]')
  .alias('repo')
  .description('clone a repo and scan it for secrets')
  .option('-C --config <precommit|minimal|deep|verydeep>', 'Set rules to use', 'deep')
  .action((repo, options) => {
    const cli = new CLI(options);
    cli.runRepo(repo);
  });

CLI.program = program;

module.exports = CLI;
