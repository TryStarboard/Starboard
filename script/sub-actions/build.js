'use strict';

const basename = require('path').basename;
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

const buildImage = co.wrap(function *(dfpath, tag, opts) {
  const cmd = opts.useCache ?
    `docker build -f ${dfpath} -t ${tag} .` :
    `docker build -f ${dfpath} -t ${tag} --no-cache .`;
  yield exec(cmd);
  if (opts.skipPush) {
    return;
  }
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
  const renderedDockerfilePath = `_build-tmp/${basename(dockerfile)}`;
  yield renderTmplToFile(
    `${dockerfile}.tmpl`,
    {baseimage_version: baseimageConf.version},
    renderedDockerfilePath
  );
  return renderedDockerfilePath;
});

/**
 * Build image
 *
 * @param {string}  targetImageName The image name without version
 * @param {Object}  opts            Options
 * @param {boolean} opts.skipPush   If true, do not push to registry
 * @param {boolean} opts.useCache   If true, do not use --no-cache flag
 *
 * @return {Promise} Resolve
 */
const build = co.wrap(function *(targetImageName, opts) {
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

  yield buildImage(dockerfilePath, imageTag, opts);

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
    yield build(childImageName, opts);
  }
});

module.exports = build;
