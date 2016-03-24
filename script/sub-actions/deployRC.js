'use strict';

const basename = require('path').basename;
const co = require('co');
const R = require('ramda');
const u = require('updeep').default; // Babel transpiled

const exec             = require('../util/ShellUtil').exec;
const readJson         = require('../util/FSUtil').readJson;
const writeJson        = require('../util/FSUtil').writeJson;
const renderTmplToFile = require('../util/FSUtil').renderTmplToFile;
const mkdir            = require('../util/FSUtil').mkdir;

function getRCConf(appLabel) {
  return readJson('config/deployment.json')
    .then((conf) => {
      const rcConf = conf[appLabel];
      if (!rcConf) {
        throw new Error(`RC with app label ${appLabel} does not exist`);
      }
      return rcConf;
    });
}

/**
 * @param {string}  appLabel
 * @param {Object}  opts
 * @param {boolean} opts.createRc
 *
 * @return {Promise} Resolve
 */
module.exports = co.wrap(function *(appLabel, opts) {
  console.log(`\n\n--> deploying ${appLabel}\n`);

  yield mkdir('_build-tmp');
  const rcoutput = yield exec('kubectl get rc -o=json', {wantReturns: true});
  const rcname = R.pipe(
    JSON.parse,
    R.prop('items'),
    R.find(R.pathEq(['metadata', 'labels', 'app'], appLabel)),
    R.path(['metadata', 'name'])
  )(rcoutput);

  if (!opts.createRc && !rcname) {
    throw new Error(`RC with app label "${appLabel}" is not found`);
  }

  const {rc_template, version, image_name} = yield getRCConf(appLabel);

  const buildConf = yield readJson('config/builds.json');
  const imageConf = buildConf[image_name];
  if (!imageConf) {
    throw new Error(`image ${image_name} is not found`);
  }

  const newVersion = version + 1;
  const renderedRCFilePath = `_build-tmp/${basename(rc_template)}`;
  yield renderTmplToFile(
    `${rc_template}.tmpl`,
    {
      version: newVersion,
      image_version: imageConf.version,
    },
    renderedRCFilePath
  );

  if (opts.createRc && !rcname) {
    yield exec(`kubectl create -f ${renderedRCFilePath}`);
  } else {
    yield exec(`kubectl rolling-update ${rcname} -f ${renderedRCFilePath}`);
  }

  const conf = yield readJson('config/deployment.json');
  yield writeJson(
    'config/deployment.json',
    u(
      {
        [appLabel]: {
          version: newVersion
        }
      },
      conf
    )
  );
});
