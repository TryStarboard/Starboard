'use strict';

const join = require('path').join;
const spawn = require('child_process').spawn;
const Bluebird = require('bluebird');

/**
 * Execute a command in shell
 *
 * @param {string}  cmd                      The command to run
 * @param {Object}  opts                     Options
 * @param {boolean} [opts.wantReturns=false] True if you want to collect stdout
 *                                           of process and don't want to dump
 *                                           them to console
 *
 * @return {Promise} Resolve with "" if opts.wantReturns is false, otherwise
 *                   the output of executed command
 */
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
