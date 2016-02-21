'use strict';

const Bluebird = require('bluebird');
const promisifyAll = Bluebird.promisifyAll;
const fromCallback = Bluebird.fromCallback;
const fs = promisifyAll(require('fs'));
const join = require('path').join;
const childProcess = promisifyAll(require('child_process'));
const spawn = childProcess.spawn;
const wrap = require('co').wrap;
const template = require('lodash/template');
const gulp = require('gulp');

gulp.task('deploy', wrap(function *() {

  yield fromCallback((done) => {
    const build = spawn(
      'npm',
      [ 'version', 'major' ],
      { stdio: 'inherit' });
    build.on('close', done);
  });

  const pkg = require('./package.json');
  const version = `v${pkg.version.split('.')[0]}`;

  yield fromCallback((done) => {
    const build = spawn(
      'env',
      [ 'NODE_ENV=production', 'npm', 'run', 'build' ],
      { stdio: 'inherit' });
    build.on('close', done);
  });

  yield fromCallback((done) => {
    const build = spawn(
      'docker',
      [ 'build', '-t', `us.gcr.io/starboard-1224/starboard:${version}`, '--no-cache', '.' ],
      { stdio: 'inherit' });
    build.on('close', done);
  });

  yield fromCallback((done) => {
    const push = spawn(
      'gcloud',
      [ 'docker', 'push', `us.gcr.io/starboard-1224/starboard:${version}` ],
      { stdio: 'inherit' });
    push.on('close', done);
  });

  const rcTmpl = yield fs.readFileAsync(join(__dirname, 'starboard-replication-controller.yml'), 'utf8');
  const newRc = template(rcTmpl)({ version });

  const output = yield childProcess.execAsync('kubectl get rc -o=json');
  const controllers = JSON.parse(output);

  let currentCtrlName;

  for (const ctrl of controllers.items) {
    if (ctrl.metadata.labels.app === 'starboard') {
      currentCtrlName = ctrl.metadata.name;
      break;
    }
  }

  if (!currentCtrlName) {
    throw new Error('cannot find starboard replication controller');
  }

  yield fromCallback((done) => {
    const rollingUpdate = spawn(
      'kubectl',
      [ 'rolling-update', currentCtrlName, '-f', '-' ],
      { stdio: [ 'pipe', 'inherit', 'inherit' ] });
    rollingUpdate.on('close', done);
    rollingUpdate.stdin.write(newRc);
    rollingUpdate.stdin.end();
  });

}));
