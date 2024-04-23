class MalType {
  constructor(val) {
    this.value = val;
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

  pr_str() {
    return '[' + this.value.map((v) => v.pr_str()).join(' ') + ']';
  }
}

class MalMap extends MalType {
  constructor(val) {
    super(val);
    this.value = [...val];
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
};
