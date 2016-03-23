'use strict';

const co = require('co');
const u = require('updeep').default; // Babel transpiled
const R = require('ramda');

const exec             = require('../util/ShellUtil').exec;
const readJson         = require('../util/FSUtil').readJson;
const writeJson        = require('../util/FSUtil').writeJson;
const renderTmplToFile = require('../util/FSUtil').renderTmplToFile;
const mkdir            = require('../util/FSUtil').mkdir;

function getImageConf(name) {
  return readJson('config/builds.json')
    .then((conf) => {
      const imageConf = conf[name];
      if (!imageConf) {
        throw new Error(`image ${name} does not exist`);
      }
      return imageConf;
    });
}

const buildImage = co.wrap(function *(dfpath, tag) {
  yield exec(`docker build -f ${dfpath} -t ${tag} --no-cache .`);
  yield exec(`gcloud docker push ${tag}`);
});

const findChildImages = co.wrap(function *(parentName) {
  const conf = yield readJson('config/builds.json');
  const confPairs = R.toPairs(conf);
  return R.pipe(
    R.filter(R.pathEq([1, 'baseimage'], parentName)),
    R.pluck(0)
  )(confPairs);
});

const renderDockerfile = co.wrap(function *({version, dockerfile, baseimage}) {
  const baseimageConf = yield getImageConf(baseimage);
  const renderedDockerfilePath = `_build-tmp/${dockerfile}`;
  yield renderTmplToFile(
    `${dockerfile}.tmpl`,
    {base_image_version: baseimageConf.version},
    renderedDockerfilePath
  );
  return renderedDockerfilePath;
});

const build = co.wrap(function *(targetImageName) {
  console.log(`\n\n--> building ${targetImageName}\n`);

  yield mkdir('_build-tmp');
  const targetImageConf = yield getImageConf(targetImageName);

  const {version, dockerfile, isTemplate} = targetImageConf;
  const newVersion = version + 1;
  const imageTag = `${targetImageName}:v${newVersion}`;
  let dockerfilePath;

  if (isTemplate) {
    dockerfilePath = yield renderDockerfile(targetImageConf);
  } else {
    dockerfilePath = dockerfile;
  }

  yield buildImage(dockerfilePath, imageTag);

  const conf = yield readJson('config/builds.json');

  yield writeJson(
    'config/builds.json',
    u(
      {
        [targetImageName]: {
          version: newVersion
        }
      },
      conf
    )
  );

  const childImageNames = yield findChildImages(targetImageName);
  for (const childImageName of childImageNames) {
    yield build(childImageName);
  }
});

module.exports = build;

// co(function *() {
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
