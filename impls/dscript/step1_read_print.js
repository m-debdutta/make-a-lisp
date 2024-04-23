const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const { read_str } = require('./reader');
const { pr_str } = require('./printer');
const { MalError } = require('./type');

const rl = readline.createInterface({ input, output });

const READ = (str) => read_str(str);
const EVAL = (str) => str;
const PRINT = (val) => pr_str(val);

const rep = () =>
  rl.question('user> ', (expStr) => {
    try {
      PRINT(EVAL(READ(expStr)));
    } catch (error) {
      PRINT(new MalError(error.message));
    }
    rep();
  });

rep();
