'use strict';

const program = require('commander');

const listRC = require('./sub-actions/listRC');
const deployRC = require('./sub-actions/deployRC');

program
  .option('--list', 'List available RC')
  .option('--deploy <rc-name>', 'Deploy target RC')
  .option('--create-rc', 'Create RC if not exist')
  .parse(process.argv);

if (program.list) {
  listRC()
  .catch((err) => {
    console.error(err);
    console.error(err.stack);
  });
} else if (program.deploy) {
  deployRC(program.deploy, {createRc: program.createRc})
  .catch((err) => {
    console.error(err);
    console.error(err.stack);
  });
} else {
  throw new Error('Must provide --list or --deploy <rc-name>');
}
