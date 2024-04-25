const { zip } = require('lodash');
const { MalType } = require('./type');

class Env {
  constructor(outer) {
    this.outer = outer;
    this.data = {};
  }

  static bind(outer, binds, exprs) {
    const env = new this(outer);
    const bindings = zip(binds, exprs);

    bindings.forEach(([symbol, expression]) => {
      env.set(symbol.value, expression);
    });

    return env;
  }

  set(symbol, malValue) {
    this.data[symbol] = malValue;
  }

  #find(symbol) {
    if (this.data[symbol]) {
      return this.data[symbol];
    }

    if (this.outer) {
      return this.outer.get(symbol);
    }
  }

  get(symbol) {
    const val = this.#find(symbol);

    if (!val) {
      throw new Error(symbol + ' not found');
    }

    return val;
  }
}

module.exports = { Env };
