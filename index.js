#!/usr/bin/env node
const { Command } = require('commander');

const initCmd = require('./lib/init');
const tagCmd = require('./lib/tag');
const queryCmd = require('./lib/query');
const configCmd = require('./lib/config');
const repairCmd = require('./lib/repair');
const listCmd = require('./lib/list');
const pkg = require('./package.json');

const program = new Command();

program.name('modmap').description('Map modules to files/functions/lines').version(pkg.version);

program
  .command('init')
  .description('Initialize .modmap with timezone')
  .requiredOption('--tz <timezone>', 'Timezone (e.g. Asia/Kolkata)')
  .action(initCmd);

program
  .command('tag')
  .description('Tag a file/function/line under a module')
  .requiredOption('--module <module>', 'Module name')
  .option('--file <path>', 'File path')
  .option('--function <name>', 'Function name')
  .option('--line <file:lineno>', 'Line in file (e.g. src/a.js:42)')
  .requiredOption('--desc <desc>', 'Description')
  .action(tagCmd);

program
  .command('query <module>')
  .description('Show tags for a module')
  .action(queryCmd);

program
  .command('config')
  .description('Change timezone (validates before applying)')
  .requiredOption('--tz <timezone>', 'New timezone')
  .action(configCmd);

program
  .command('repair')
  .description('Repair missing/invalid timestamps')
  .option('--fill-now', 'Fill missing timestamps with current time in configured timezone')
  .option('--fill-mtime', 'Fill missing timestamps from file mtime if entry.file exists')
  .action(repairCmd);

program
  .command('list')
  .description('List all modules tracked in .modmap')
  .action(listCmd);

program.parse(process.argv);
