'use strict';

const path = require('path');
const fs = require('fs');

function statAsync(file) {
  return new Promise((resolve, reject) => {
    fs.stat(file, (err, stats) => {
      if(err) return reject(err);
      return resolve(stats);
    });
  });
}

function readdirAsync(dirpath) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirpath, (err, files) => {
      if(err) return reject(err);
      return resolve(files);
    });
  });
}

function recurseDir(dirpath) {
  const filenames = [];

  return readdirAsync(dirpath).then((files) => {
    const proms = [];

    for(const f of files) {
      const filepath = path.resolve(dirpath, f);

      // what do we do with this file
      const prom = statAsync(filepath).then((stats) => {
        if(stats.isDirectory()) {
          return recurseDir(filepath).then((nextfiles) => {
            for(const ff of nextfiles) {
              filenames.push(ff);
            }
          });
        } else if(stats.isFile()) {
          filenames.push(filepath);
        }
      });
      proms.push(prom);
    }

    return Promise.all(proms).then(() => { return filenames; });
  });
}

module.exports = {
  recurseDir: recurseDir
};
