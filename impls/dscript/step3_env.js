const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const { read_str } = require('./reader');
const { pr_str } = require('./printer');
const {
  MalError,
  MalSymbol,
  MalVector,
  MalType,
  MalList,
  MalMap,
  MalNil,
} = require('./type');
const { Env } = require('./env');
const { chunk } = require('lodash');

const rl = readline.createInterface({ input, output });

const repl_env = new Env(null);

repl_env.set('+', (a, b) => new MalType(a + b));
repl_env.set('-', (a, b) => new MalType(a - b));
repl_env.set('*', (a, b) => new MalType(a * b));
repl_env.set('/', (a, b) => new MalType(a / b));

const eval_ast = (ast, repl_env) => {
  switch (true) {
    case ast instanceof MalSymbol:
      if (repl_env.get(ast.value) === undefined) throw new Error('invalid function');
      return repl_env.get(ast.value);

    case ast instanceof MalList:
      return new MalList(ast.value.map((a) => EVAL(a, repl_env)));

    case ast instanceof MalVector:
      return new MalVector(ast.value.map((a) => EVAL(a, repl_env)));

    case ast instanceof MalMap:
      return new MalMap(ast.value.map((a) => EVAL(a, repl_env)));

    default:
      return ast;
  }
};

const evalLet = (ast, repl_env) => {
  const newEnv = new Env(repl_env);
  const [_, args, list] = ast.value;
  const bindings = chunk(args.value, 2);

  bindings.forEach(([symbol, value]) => {
    newEnv.set(symbol.value, EVAL(value, newEnv));
  });

  if (list) return EVAL(list, newEnv);

  return new MalNil();
};

const evalDef = (ast, repl_env) => {
  const [_, symbol, valAst] = ast.value;
  const val = EVAL(valAst, repl_env);
  repl_env.set(symbol.value, val);

  return val;
};

const evalList = (ast, repl_env) => {
  const [fun, ...args] = eval_ast(ast, repl_env).value;

  return fun.apply(
    null,
    args.map((a) => a.value)
  );
};

const EVAL = (ast, repl_env) => {
  switch (true) {
    case !(ast instanceof MalList):
      return eval_ast(ast, repl_env);

    case ast.value.length === 0:
      return ast;

    case ast.value[0].value === 'def!':
      return evalDef(ast, repl_env);

    case ast.value[0].value === 'let*':
      return evalLet(ast, repl_env);

    default:
      return evalList(ast, repl_env);
  }
};

const READ = (str) => read_str(str);

const PRINT = (ast) => pr_str(ast);

const rep = () =>
  rl.question('user> ', (expStr) => {
    try {
      PRINT(EVAL(READ(expStr), repl_env));
    } catch (error) {
      PRINT(new MalError(error.message));
    }
    rep();
  });

rep();
