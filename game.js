const readline = require('node:readline');
const { stdin: input, stdout: output, argv } = require('node:process');
const fs = require('node:fs');
const path = require('path');

const randomNumber = () => {
  return Math.floor(Math.random() * 2 + 1);
};

const game = () => { 
  return new Promise((resolve, reject) => {
    console.log('Отгадай - орёл или решка. 1 - решка, 2 - орёл.');
    const coin = randomNumber();
    // console.log(coin);
    const rl = readline.createInterface({ input, output });

    rl.prompt();
    rl.on('line', line => {
      if (!(line === '1' || line === '2')) {
        console.log('Надо ввести 1 или 2');
      } else if (+line === coin) {
        console.log('Победа! Вы угадали.');
        rl.close();
        resolve(true);
      } else {
        console.log('Неудача :( повезет в следующий раз.');
        rl.close();
        resolve(false);
      }
      rl.prompt();
    }).on('close', () => {
      console.log('Good by!');      
    });
  });  
};

const promptToContinue = () => {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({ input, output });

    rl.prompt();
    console.log('Хотите продолжить? y - да, n - нет');
    rl.on('line', line => {
      if (!(line.toLowerCase() === 'y' || line === 'n')) {
        console.log('Надо ввести y или n');
      } else if (line.toLowerCase() === 'y') {
        rl.close();
        resolve(true);
      } else {
        rl.close();
        resolve(false);       
      }
      rl.prompt();
    });
  });  
}

const writeLog = (file, data) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, file);
    const writeStream = fs.createWriteStream(filePath, {flags: 'a'});
    
    writeStream.write(data, 'UTF8');    
    writeStream.end();

    writeStream.on('finish', () => {
      resolve();
    });

    writeStream.on('error', (err) => {
      console.error('error');
      reject(err);
    });
  });  
};

const readLog = (file) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, file);
    const readStream = fs.createReadStream(filePath);
    let data = '';
    
    readStream.setEncoding('UTF8');    
    readStream.on('data', chank => data += chank);

    readStream.on('end', () => {
      console.log('Log readed');
      resolve(data);
    });

    readStream.on('error', (err) => {
      console.error('error');
      reject(err);
    });
  });  
};

const start = async (argv) => {
  const results = [];
  console.log(argv);
  
  while(true) {
    const win = await game();    
    
    results.push({ win });
    
    const isContinue = await promptToContinue();

    if (!isContinue) {
      const winCount = results.reduce((acc, { win }) => Number(win) + acc, 0);
      const resultStr = JSON.stringify(results);

      console.log(`Результаты: угадано - ${winCount}, не угадано - ${results.length - winCount}.`);
      
      await writeLog(argv.f, resultStr.slice(1, resultStr.length - 1) + ',');
      process.exit(0);      
    }
  }  
};

const analyse = async (argv) => {
  const logData = await readLog(argv.f);
  const results = JSON.parse(`[${logData.slice(0, logData.length - 1)}]`);
  const winCount = results.reduce((acc, { win }) => Number(win) + acc, 0);
  
  console.log(
    '\nСтатистика игр:\n -------------\n',
    'Общее количество партий: ', results.length, '\n',
    'Количество выигранных/проигранных партий: ', winCount, '/', results.length - winCount, '\n',
    'Процентное соотношение выигранных партий: ', (100 * winCount / results.length).toFixed(), '%'
  );
};

module.exports = { start, analyse };
