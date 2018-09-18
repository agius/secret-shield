'use strict';

const path = require('path');
const fs = require('fs');

const File = require('./file');

function flatten(arr) {
  return [].concat.apply([], arr);
}

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
  return readdirAsync(dirpath).then((files) => {
    const proms = [];

    for(const f of files) {
      const filepath = path.resolve(dirpath, f);

      // what do we do with this file
      const prom = statAsync(filepath).then((stats) => {
        if(stats.isDirectory()) {
          return recurseDir(filepath);
        } else if(stats.isFile()) {
          const fileObj = new File({path: filepath, stats: stats});
          return [fileObj];
        }
      });
      proms.push(prom);
    }

    return Promise.all(proms).then((fileObjs) => {
      return flatten(fileObjs);
    });
  });
}

module.exports = {
  recurseDir: recurseDir,
  statAsync: statAsync,
  readdirAsync: readdirAsync,
  flatten: flatten
};
