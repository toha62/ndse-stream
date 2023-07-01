#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const month = ['Jan', 'Feb', 'Mar', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const current = (argv) => {
  const date = new Date();
  
  if (argv.d) {
    console.log(date.getDate());
  }
  if (argv.m) {
    console.log(month[date.getMonth()]);
  }
  if (argv.y) {
    console.log(date.getFullYear());
  } 
  if (!(argv.d || argv.m || argv.y)) {
    console.log(date.toISOString());
  } 
}

const getShiftedDate = (argv, sign = 1) => {
  const date = new Date();
  
  if (argv.d) {
    date.setDate(date.getDate() + argv.d * sign);
  }
  if (argv.m) {
    date.setMonth(date.getMonth() + argv.m * sign);
  }
  if (argv.y) {
    date.setFullYear(date.getFullYear() + argv.y * sign);
  }
  
  return date.toISOString();
}

const sub = (argv) => {  
  console.log(getShiftedDate(argv, -1));
}

const add = (argv) => {
  console.log(getShiftedDate(argv));
}

const optionsCurrent = (yargs) => {
  return yargs
    .option('years', {
      alias: 'y',
      type: 'boolean',
      describe: 'current year'
    })
    .option('month', {
      alias: 'm',
      type: 'boolean',
      description: 'current month'
    })
    .option('date', {
      alias: 'd',
      type: 'boolean',
      description: 'current date'        
    })
};

const optionsAddSub = (yargs) => {
  return yargs
    .option('years', {
      alias: 'y',
      type: 'number',
      nargs: 1,
      describe: 'count of year to shift'
    })
    .option('month', {
      alias: 'm',
      type: 'number',
      nargs: 1,
      description: 'count of month to shift'
    })
    .option('date', {
      alias: 'd',
      type: 'number',
      nargs: 1,
      description: 'count of date to shift'        
    })
};

const argv = yargs(hideBin(process.argv))
  .command(
    'current',
    'current date and time in ISO',
    optionsCurrent,
    current
  )
  .command(
    'sub',
    'date, time in past',
    optionsAddSub,
    sub
  )
  .command(
    'add',
    'date, time in future',
    optionsAddSub,
    add
  )
  .demandCommand(1, 1, 'choose a command: current, add or sub')
  .strict()
  .help('h')
  .argv;
