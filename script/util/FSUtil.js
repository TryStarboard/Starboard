'use strict';

const join = require('path').join;
const fs = require('mz/fs');
const template = require('lodash/template');

function readJson(fpath) {
  return fs.readFile(join(__dirname, '../..', fpath), 'utf8')
    .then(JSON.parse);
}

function writeJson(fpath, obj) {
  const content = JSON.stringify(obj, null, 2);
  return fs.writeFile(join(__dirname, '../..', fpath), content, 'utf8');
}

function renderTmplToFile(tpath, locals, dpath) {
  return fs.readFile(join(__dirname, '../..', tpath), 'utf8')
    .then((fcontent) => fs.writeFile(
      join(__dirname, '..', dpath),
      template(fcontent)(locals),
      'utf8'
    ));
}

function mkdir(dpath) {
  return fs.mkdir(join(__dirname, '../..', dpath))
    .catch((err) => {
      if (err.code !== 'EEXIST') {
        throw err;
      }
    });
}

module.exports = {
  readJson,
  writeJson,
  renderTmplToFile,
  mkdir,
};
