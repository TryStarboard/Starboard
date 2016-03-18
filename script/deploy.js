'use strict';

const join = require('path').join;
const Bluebird = require('bluebird');
const fs = Bluebird.promisifyAll(require('fs'));
const co = require('co');
const template = require('lodash/template');
const program = require('commander');
const exec = require('./util/ShellUtil').exec;

const DCONFIG_PATH = 'config/deployment.json';

program
  .option('--build-node', 'Build node, node_modules and app, then deploy')
  .option('--build-node-modules', 'Build node_modules and app, then deploy')
  .option('--create-rc', 'Create RC if not exist')
  .parse(process.argv);

const buildImage = co.wrap(function *(imageconfig) {
  const {name, version, dockerfile, isTemplate} = imageconfig;
  let dfpath;
  if (isTemplate) {
    dfpath = `_build-tmp/${dockerfile}`;
    yield renderTmplToFile(dockerfile, {base_image_version: version}, dfpath);
  } else {
    dfpath = dockerfile;
  }
  const image = `${name}:${version}`;
  yield exec(`docker build -f ${dfpath} -t ${image} --no-cache .`);
  yield exec(`gcloud docker push ${image}`);
});

co(function *() {
  try {
    yield fs.mkdir(join(__dirname, '../_build-tmp'));
  } catch (err) {
    console.log(err);
  }

  const dconfig = yield readJson(DCONFIG_PATH);

  if (program.buildNode) {
    dconfig.images[0].version += 1;
    yield buildImage(dconfig.images[0]);
    yield writeJson(DCONFIG_PATH, dconfig);
  }

  if (program.buildNodeModules) {
    dconfig.images[1].version += 1;
    yield buildImage(dconfig.images[1]);
    yield writeJson(DCONFIG_PATH, dconfig);
  }

  yield exec('npm version major');
  yield exec('env NODE_ENV=production npm run build');

  dconfig.images[2].version += 1;
  yield buildImage(dconfig.images[2]);
  yield writeJson(DCONFIG_PATH, dconfig);

  const {version} = dconfig.images[2];

  const rcoutput = yield exec('kubectl get rc -o=json', {wantReturns: true});
  const controllers = JSON.parse(rcoutput);

  let currentCtrlName;

  for (const ctrl of controllers.items) {
    if (ctrl.metadata.labels.app === 'starboard') {
      currentCtrlName = ctrl.metadata.name;
      break;
    }
  }

  const newRcFilePath = '_build-tmp/starboard-replication-controller.yml';
  yield renderTmplToFile(
    'starboard-replication-controller.yml.tmpl',
    {version},
    newRcFilePath);

  if (!currentCtrlName) {
    if (program.createRc) {
      console.log('cannot find "starboard" replication controller, creating one');
      yield exec(`kubectl create -f ${newRcFilePath}`);
    } else {
      throw new Error('cannot find "starboard" replication controller');
    }
  } else {
    yield exec(`kubectl rolling-update ${currentCtrlName} -f ${newRcFilePath}`);
  }
})
.catch((err) => {
  console.error(err);
  console.error(err.stack);
});

function readJson(fpath) {
  return fs.readFileAsync(join(__dirname, '..', fpath), 'utf8')
    .then(JSON.parse);
}

function writeJson(fpath, obj) {
  const content = JSON.stringify(obj, null, 2);
  return fs.writeFileAsync(join(__dirname, '..', fpath), content, 'utf8');
}

function renderTmplToFile(tpath, locals, dpath) {
  return fs.readFileAsync(join(__dirname, '..', tpath), 'utf8')
    .then((fcontent) => fs.writeFileAsync(
      join(__dirname, '..', dpath),
      template(fcontent)(locals),
      'utf8'
    ));
}
