const readline = require('node:readline');
const {stdin: input, stdout: output} = require('node:process');
const {read_str} = require('./reader');
const {pr_str} = require('./printer');
const {
    MalError,
    MalSymbol,
    MalVector,
    MalList,
    MalMap,
    MalNil,
    MalFunction,
    MalString,
} = require('./type');
const {Env} = require('./env');
const {chunk} = require('lodash');
const core = require('./core');

const rl = readline.createInterface({input, output});

const repl_env = new Env(null);

const loadEnv = () => {
    Object.entries(core).forEach(([symbol, func]) => repl_env.set(symbol, func));
};

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

const evalDo = (ast, repl_env) => {
    const [_, ...exprs] = ast.value;
    const last = exprs.pop();
    exprs.forEach(exp => EVAL(exp, repl_env))

    return last;
};

const evalLet = (ast, repl_env) => {
    const newEnv = new Env(repl_env);
    const [_, args, ...lists] = ast.value;
    const bindings = chunk(args.value, 2);

    bindings.forEach(([symbol, value]) => {
        newEnv.set(symbol.value, EVAL(value, newEnv));
    });

    if (lists) return evalDo(new MalList(['do', ...lists]), newEnv);

    return new MalNil();
};

const evalDef = (ast, repl_env) => {
    const [_, symbol, valAst] = ast.value;
    const val = EVAL(valAst, repl_env);
    repl_env.set(symbol.value, val);

    return val;
};

const evalFn = (ast, repl_env) => {
    const [_, bindings, ...expressions] = ast.value;
    return new MalFunction(bindings, expressions, repl_env);
};

const evalIf = (ast, repl_env) => {
    const [_, pred, trueCondition, falseCondition] = ast.value;
    const predVal = EVAL(pred, repl_env).value;

    if (predVal === 0 || predVal) {
        return trueCondition;
    }

    return falseCondition || new MalNil();
};

const EVAL = (ast, env) => {
    while (true) {
        if (!(ast instanceof MalList)) return eval_ast(ast, env);

        if (ast.value.length === 0) return ast;

        switch (ast.value[0].value) {
            case 'do':
                ast = evalDo(ast, env);
                break;
            case 'def!':
                return evalDef(ast, env);

            case 'let*':
                return evalLet(ast, env);

            case 'if':
                ast = evalIf(ast, env);
                break;
            case 'fn*':
                return evalFn(ast, env);
            default:
                const [fun, ...args] = eval_ast(ast, env).value;

                if (fun instanceof MalFunction) {
                    env = Env.bind(fun.repl_env, fun.bindings.value, args);
                    ast = new MalList([new MalString('do'), ...fun.expressions]);
                    break;
                }

                if (fun instanceof Function) return fun.apply(null, args);
        }
    }
};

const READ = (str) => read_str(str);

const PRINT = (ast) => pr_str(ast);

const rep = () =>
    rl.question('user> ', (expStr) => {
        try {
            PRINT(EVAL(READ(expStr), repl_env));
        } catch (error) {
            PRINT(new MalError(error));
        }
        rep();
    });

loadEnv();
rep();

