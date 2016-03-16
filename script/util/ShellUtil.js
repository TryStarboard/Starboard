'use strict';

const join = require('path').join;
const spawn = require('child_process').spawn;
const Bluebird = require('bluebird');

function exec(cmd) {
  return new Bluebird((resolve, reject) => {
    console.log(`---> Executing "${cmd}"`);
    const args = cmd.split(' ');
    const child = spawn(args[0], args.slice(1), {
      cwd: join(__dirname, '../..'),
      stdio: 'inherit', // we want it to output to console like a shell script
    });
    let response = '';
    child.on('data', function (buffer) {
      response += buffer.toString();
    });
    child.on('exit', function (code, signal) {
      if (code === 0 || code == null) {
        resolve(response);
      } else {
        reject(new Error(`"${cmd}" exited with code ${code} ${signal}`));
      }
    });
  });
}

module.exports = {
  exec,
};
