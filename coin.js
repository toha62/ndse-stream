#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const game = require('./game');
const analyse = require('./analyse');
// const readline = require('node:readline');
// const { stdin: input, stdout: output } = require('node:process');

const options = yargs => {
  return yargs
    .option(
      'file',
    {
      alias: 'f',
      nargs: 1,
      demandOption: true,
      type: 'string',
      description: '<file> Filename to read/write a log'
    })
};

const argv = yargs(hideBin(process.argv))
  .command({
    command: 'start',
    aliases: 's',
    desc: 'Start game with logging result',
    builder: options,
    handler: game,
  })
  .command({
    command: 'analyse',
    aliases: 'a',
    desc: 'Start analyse results of game',
    builder: options,
    handler: analyse,
  })
  .demandCommand(1, 1, 'You need at least one command before moving on')
  .strict()
  .help('h')
  .argv
