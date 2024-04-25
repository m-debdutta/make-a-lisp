const isIterable = (list) => list instanceof MalList || list instanceof MalVector;

class MalType {
  constructor(val) {
    this.value = val;
  }

  isEqual(a) {
    return this.value === a.value;
  }

  pr_str() {
    return this.value.toString();
  }
}

class MalNumber extends MalType {
  constructor(val) {
    super(val);
    this.value = val;
  }
}

class MalSymbol extends MalType {
  constructor(val) {
    super(val);
    this.value = val;
  }
}

class MalList extends MalType {
  constructor(val) {
    super(val);
    this.value = [...val];
  }

  isEqual(list) {
    if (isIterable(list)) {
      return (
        list.value.length === this.value.length &&
        list.value.every((a, index) => this.value[index].isEqual(a))
      );
    }

    return false;
  }

  pr_str() {
    return '(' + this.value.map((v) => v.pr_str()).join(' ') + ')';
  }
}

class MalError extends MalType {
  constructor(val) {
    super(val);
    this.value = val;
  }
}

class MalVector extends MalType {
  constructor(val) {
    super(val);
    this.value = [...val];
  }

  isEqual(list) {
    return list.value.every((a, index) => this.value[index].isEqual(a));
  }

  pr_str() {
    return '[' + this.value.map((v) => v.pr_str()).join(' ') + ']';
  }
}

class MalMap extends MalType {
  constructor(val) {
    super(val);
    this.value = [...val];
  }

  isEqual(list) {
    return list.value.every((a, index) => this.value[index].isEqual(a));
  }

  pr_str() {
    return '{' + this.value.map((v) => v.pr_str()).join(' ') + '}';
  }
}

class MalString extends MalType {
  constructor(val) {
    super(val);
    this.value = val;
  }
}

class MalKeyword extends MalType {
  constructor(val) {
    super(val);
    this.value = val;
  }
}

class MalNil extends MalType {
  constructor() {
    super(null);
    this.value = null;
  }

  pr_str() {
    return 'nil';
  }
}

class MalBool extends MalType {
  constructor(val) {
    super(val);
    this.value = val;
  }
}

class MalFunction extends MalType {
  constructor(bindings, expressions, repl_env) {
    super('#<function>');
    this.bindings = bindings;
    this.expressions = expressions;
    this.repl_env = repl_env;
  }

  pr_str() {
    return '#<function>';
  }
}

module.exports = {
  MalNumber,
  MalList,
  MalSymbol,
  MalError,
  MalVector,
  MalType,
  MalMap,
  MalString,
  MalKeyword,
  MalNil,
  MalBool,
  MalFunction,
};
