// 'use strict';

// const join = require('path').join;
// const Bluebird = require('bluebird');
// const fs = require('mz/fs');
// const co = require('co');
// const program = require('commander');

// const exec = require('./util/ShellUtil').exec;
// const readJson = require('./util/FSUtil').readJson;
// const writeJson = require('./util/FSUtil').writeJson;
// const renderTmplToFile = require('./util/FSUtil').renderTmplToFile;
// const mkdir = require('./util/FSUtil').mkdir;

// const BUILDS_CONF_PATH = 'config/builds.json';
// const DCONFIG_PATH = 'config/deployment.json';

// program
//   .option('--build-node', 'Build node, node_modules and app, then deploy')
//   .option('--build-node-modules', 'Build node_modules and app, then deploy')
//   .option('--create-rc', 'Create RC if not exist')
//   .parse(process.argv);

// const buildImage = co.wrap(function *(imageconfig, baseImageVersion) {
//   const {name, version, dockerfile, isTemplate} = imageconfig;
//   let dfpath;
//   if (isTemplate) {
//     dfpath = `_build-tmp/${dockerfile}`;
//     yield renderTmplToFile(`${dockerfile}.tmpl`, {base_image_version: baseImageVersion}, dfpath);
//   } else {
//     dfpath = dockerfile;
//   }
//   const image = `${name}:${version}`;
//   yield exec(`docker build -f ${dfpath} -t ${image} --no-cache .`);
//   yield exec(`gcloud docker push ${image}`);
// });

// co(function *() {
//   yield mkdir(join(__dirname, '../_build-tmp'));

//   const dconfig = yield readJson(DCONFIG_PATH);

//   if (program.buildNode) {
//     dconfig.images[0].version += 1;
//     yield buildImage(dconfig.images[0]);
//     yield writeJson(DCONFIG_PATH, dconfig);
//   }

//   if (program.buildNode || program.buildNodeModules) {
//     dconfig.images[1].version += 1;
//     yield buildImage(dconfig.images[1], dconfig.images[0].version);
//     yield writeJson(DCONFIG_PATH, dconfig);
//   }

//   yield exec('env NODE_ENV=production npm run build');

//   dconfig.images[2].version += 1;
//   yield buildImage(dconfig.images[2], dconfig.images[1].version);
//   yield writeJson(DCONFIG_PATH, dconfig);

//   const {version} = dconfig.images[2];

//   const rcoutput = yield exec('kubectl get rc -o=json', {wantReturns: true});
//   const controllers = JSON.parse(rcoutput);

//   let currentCtrlName;

//   for (const ctrl of controllers.items) {
//     if (ctrl.metadata.labels.app === 'starboard') {
//       currentCtrlName = ctrl.metadata.name;
//       break;
//     }
//   }

//   const newRcFilePath = '_build-tmp/starboard-replication-controller.yml';
//   yield renderTmplToFile(
//     'starboard-replication-controller.yml.tmpl',
//     {version},
//     newRcFilePath);

//   if (!currentCtrlName) {
//     if (program.createRc) {
//       console.log('cannot find "starboard" replication controller, creating one');
//       yield exec(`kubectl create -f ${newRcFilePath}`);
//     } else {
//       throw new Error('cannot find "starboard" replication controller');
//     }
//   } else {
//     yield exec(`kubectl rolling-update ${currentCtrlName} -f ${newRcFilePath}`);
//   }
// })
// .catch((err) => {
//   console.error(err);
//   console.error(err.stack);
// });
