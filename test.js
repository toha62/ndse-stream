const fs = require('node:fs');
const path = require('path');

const content = [{win: true}, {win: false}];
const filePath = path.join(__dirname, 'output.txt');

// const writerSrt = fs.createWriteStream('output.txt');
const writerSrt = fs.createWriteStream(filePath);
console.log(writerSrt);
writerSrt.write(JSON.stringify(content), 'UTF8');
console.log(writerSrt);
writerSrt.end()
console.log(writerSrt);

writerSrt.on('finish', () => {
    console.log('finish')
});

writerSrt.on('close', () => {
    console.log('close')
});

writerSrt.on('error', () => {
    console.error('error')
});

