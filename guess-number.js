#!/usr/bin/env node
const readline = require('node:readline');
const { stdin: input, stdout: output, } = require('node:process');

const randomNumber = (from, to) => {
  return Math.floor(Math.random() * (to - from + 1) + from);
};

const getRange = (rlInterface) => {
  let range = [];

  return new Promise((resolve, reject) => {    
    rlInterface.prompt();

    console.log('Задайте нижнюю и верхнюю границу диапазона через пробел');

    rlInterface.on('line', (line) => {
      range = line.trim().split(' ').map(item => +item);
      
      if (range.length !== 2) {
        console.log('Надо задать два значения через пробел');    
      } else if (!range.reduce((acc, item) => Number.isInteger(item) && acc, true)) {
        console.log('Нужно ввести число!');
      } else { 
        rlInterface.close();     
        resolve(range);             
      }    
      rlInterface.prompt();
    });     
  });  
};

const startGame = (rlInterface, range) => {  

  return new Promise((resolve, reject) => {
    const target = randomNumber(range[0], range[1]);
    // console.log('target number - ', target);
    console.log(`Загадано число в диапазоне от ${range[0]} до ${range[1]}`);

    rlInterface.prompt();

    rlInterface.on('line', (line) => {  
      if (!Number.isInteger(+line)) {
        console.log('Нужно ввести число!');
      } else if (+line > target) {
        console.log('Меньше');
      } else if (+line < target) {
        console.log('Больше');
      } else {
        console.log(`Отгадано число ${target}`);
        rlInterface.close();
        resolve();        
      }
      rlInterface.prompt();
    });    
  });
};

const rl = readline.createInterface({ input, output });

getRange(rl)
  .then(range => {
    range.sort((a, b) => a - b);    
    const rl = readline.createInterface({ input, output });
    return startGame(rl, range);
    
  })
  .then(() => process.exit(0));
