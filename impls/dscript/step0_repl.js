const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

const READ = (str) => str;
const EVAL = (str) => str;
const PRINT = (str) => console.log(str);

const readStdin = () =>
  rl.question('user> ', (expStr) => {
    PRINT(EVAL(READ(expStr)));
    readStdin();
  });

readStdin();
