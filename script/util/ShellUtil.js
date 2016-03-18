'use strict';

const join = require('path').join;
const spawn = require('child_process').spawn;
const Bluebird = require('bluebird');

function exec(cmd, opts) {
  return new Bluebird((resolve, reject) => {
    console.log(`---> Executing "${cmd}"`);
    const args = cmd.split(' ');
    const child = spawn(args[0], args.slice(1), {
      cwd: join(__dirname, '../..'),
      stdio: opts && opts.wantReturns ? ['inherit', 'pipe', 'inherit'] : 'inherit',
    });
    let response;
    if (opts && opts.wantReturns) {
      response = '';
      child.stdout.on('data', function (buffer) {
        response += buffer.toString();
      });
    }
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
