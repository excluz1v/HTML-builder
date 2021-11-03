const fs = require('fs');
const path = require('path');


const correctPath = path.join(__dirname, 'text.txt');
let myReadebleStream = fs.createReadStream(correctPath, 'utf-8');

myReadebleStream.on('data', (chunk) => console.log(chunk));