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

const EVAL = (ast, repl_env) => {
  if (!(ast instanceof MalList)) return eval_ast(ast, repl_env);

  if (ast.value.length === 0) return ast;

  if (ast.value[0].value === 'def!') {
    const [_, symbol, valAst] = ast.value;
    const val = EVAL(valAst, repl_env);
    repl_env.set(symbol.value, val);

    return val;
  }

  if (ast.value[0].value === 'let*') {
    const newEnv = new Env(repl_env);
    const [_, args, list] = ast.value;
    const bindings = args.value;

    for (i = 0; i < bindings.length; i = i + 2) {
      const symbol = bindings[i].value;
      const value = EVAL(bindings[i + 1], newEnv);

      newEnv.set(symbol, value);
    }

    if (list !== undefined) return EVAL(list, newEnv);

    return new MalNil();
  }

  const [fun, ...args] = eval_ast(ast, repl_env).value;

  return fun.apply(
    null,
    args.map((a) => a.value)
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
    }
    rep();
  });

rep();
