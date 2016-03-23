'use strict';

const co = require('co');
const program = require('commander');

const readJson = require('./util/FSUtil').readJson;
const build = require('./sub-actions/build');

program
  .option('--list', 'Show images available to build')
  .option('--build <image-name>', 'Build specified image')
  .option('--skip-push', 'Do not push to registry')
  .option('--use-cache', 'Do not use --no-cache flag')
  .parse(process.argv);

if (program.list) {
  co(function *() {
    const conf = yield readJson('config/builds.json');
    console.log(Object.keys(conf).join('\n'));
  })
  .catch((err) => {
    console.error(err);
    console.error(err.stack);
  });
} else if (program.build) {
  build(program.build, {skipPush: program.skipPush, useCache: program.useCache})
  .catch((err) => {
    console.error(err);
    console.error(err.stack);
  });
} else {
  throw new Error('Must provide --list or --build <image-name>');
}
