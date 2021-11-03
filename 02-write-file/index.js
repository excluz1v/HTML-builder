const readline = require('readline');
const fs = require('fs');
const path = require('path');

let txtFile = path.join(__dirname, 'text.txt');
let { stdin: input, stdout: output } = require('process');

const rl = readline.createInterface({ input, output });
const addToFile = async (input = '', fileName = txtFile) => {
    try {
        await fs.promises.appendFile(fileName, input);
    }
    catch (error) {
        console.log(error);
    }
};
addToFile();


rl.question('Hello, write text please \n', async (answer) => {
    await addToFile(answer);
});
rl.on('line', async (input) => {
    if (input === 'exit') rl.close();
    else await addToFile(input);
});
rl.on('close', () => {
    console.log('Good Bye');
});
