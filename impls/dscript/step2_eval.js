const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const { read_str } = require('./reader');
const { pr_str } = require('./printer');
const { MalError, MalSymbol, MalVector, MalType, MalList, MalMap } = require('./type');

const rl = readline.createInterface({ input, output });

repl_env = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => Math.floor(a / b),
};

const eval_ast = (ast, repl_env) => {
  if (ast instanceof MalSymbol) {
    if (repl_env[ast.value] === undefined) throw new Error('invalid function');
    return repl_env[ast.value];
  }

  if (ast instanceof MalList) {
    return new MalList(ast.value.map((a) => EVAL(a, repl_env)));
  }

  if (ast instanceof MalVector) {
    return new MalVector(ast.value.map((a) => EVAL(a, repl_env)));
  }

  if (ast instanceof MalMap) {
    return new MalMap(ast.value.map((a) => EVAL(a, repl_env)));
  }

  return ast;
};

const EVAL = (ast, repl_env) => {
  if (!(ast instanceof MalList)) return eval_ast(ast, repl_env);

  if (ast.value.length === 0) return ast;

  const [fun, ...args] = eval_ast(ast, repl_env).value;

  return new MalType(
    fun.apply(
      null,
      args.map((a) => a.value)
    )
  );
};

const READ = (str) => read_str(str);

const PRINT = (ast) => pr_str(ast);

const rep = () =>
  rl.question('user> ', (expStr) => {
    try {
      PRINT(EVAL(READ(expStr), repl_env));
    } catch (error) {
      PRINT(new MalError(error.message));
      rep();
    }
    rep();
  });

rep();
