const { pr_str } = require('./printer');
const {
  MalNumber,
  MalBool,
  MalList,
  MalVector,
  MalNil,
  MalString,
  MalType,
} = require('./type');

const isIterable = ([list]) => list instanceof MalList || list instanceof MalVector;

const add = (a, b) => new MalNumber(a.value + b.value);
const subtract = (a, b) => new MalNumber(a.value - b.value);
const multiply = (a, b) => new MalNumber(a.value * b.value);
const divide = (a, b) => new MalNumber(a.value / b.value);
const isEqual = (a, b) => new MalBool(a.isEqual(b));
const isGreaterEqual = (a, b) => new MalBool(a.value >= b.value);
const isLessEqual = (a, b) => new MalBool(a.value <= b.value);
const isGreater = (a, b) => new MalBool(a.value > b.value);
const isLess = (a, b) => new MalBool(a.value < b.value);
const count = (...a) => {
  if (!a[0].value) {
    return new MalNumber(0);
  }

  if (isIterable(a)) {
    const [list] = a;
    return new MalNumber(list.value.length);
  }

  return new MalNumber(a.length);
};
const list = (...list) => new MalList(list);
const isList = (list) => new MalBool(list.constructor.name === 'MalList');
const isEmpty = (list) => new MalBool(list.value.length === 0);
const core_pr_str = (val) => {
  if (!val) return pr_str(new MalType(''));
  pr_str(val) || pr_str(new MalType(''));
};

const str = (...args) => new MalString(args.map((a) => a.pr_str()).join(''));
const prn = (malType) => {
  pr_str(new MalString(malType.pr_str()));
  return new MalNil();
};
const not = (a) => new MalBool(!(a.value || a.value === 0));

const core = {
  '+': add,
  '-': subtract,
  '*': multiply,
  '/': divide,
  '=': isEqual,
  '>=': isGreaterEqual,
  '<=': isLessEqual,
  '>': isGreater,
  '<': isLess,
  'list?': isList,
  'empty?': isEmpty,
  pr_str: core_pr_str,
  prn,
  list,
  str,
  not,
  count,
};

module.exports = core;
