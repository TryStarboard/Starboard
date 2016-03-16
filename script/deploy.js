'use strict';

const join = require('path').join;
const Bluebird = require('bluebird');
const fs = Bluebird.promisifyAll(require('fs'));
const co = require('co');
const template = require('lodash/template');
const exec = require('./util/ShellUtil').exec;

co(function *() {
  yield exec('npm version major');

  const pkg = require('../package.json');
  const version = `v${pkg.version.split('.')[0]}`;

  yield exec('env NODE_ENV=production npm run build');
  yield exec(`docker build -t us.gcr.io/starboard-1224/starboard:${version} --no-cache .`);
  yield exec(`gcloud docker push us.gcr.io/starboard-1224/starboard:${version}`);

  const rcTmpl = yield fs.readFileAsync(join(__dirname, '../starboard-replication-controller.yml'), 'utf8');
  const newRc = template(rcTmpl)({ version });

  try {
    yield fs.mkdirAsync(join(__dirname, '../_build-artifacts'));
  } catch (err) {
    // if (err.code !== )
    console.error(err.code);
  }

  const newRcFilePath = join(__dirname, '../_build-artifacts/starboard-replication-controller.yml');

  yield fs.writeFileAsync(newRcFilePath, newRc, 'utf8');

  const output = yield exec('kubectl get rc -o=json', {wantReturns: true});
  const controllers = JSON.parse(output);

  let currentCtrlName;

  for (const ctrl of controllers.items) {
    if (ctrl.metadata.labels.app === 'starboard') {
      currentCtrlName = ctrl.metadata.name;
      break;
    }
  }

  if (!currentCtrlName) {
    console.log('cannot find starboard replication controller, creating one');
    yield exec(`kubectl create -f ${newRcFilePath}`);
  } else {
    yield exec(`kubectl rolling-update ${currentCtrlName} -f ${newRcFilePath}`);
  }
})
.catch(console.error);
