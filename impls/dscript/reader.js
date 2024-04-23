const { MalNumber, MalList, MalSymbol, MalVector } = require('./type');

const tokenize = (str) => {
  const regex = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g;
  return [...str.matchAll(regex)].map((a) => a[1]).slice(0, -1);
};

class Reader {
  constructor(tokens) {
    this.tokens = [...tokens];
    this.position = 0;
  }

  peek() {
    return this.tokens[this.position];
  }

  next() {
    const currentToken = this.peek();
    this.position = this.position + 1;
    return currentToken;
  }
}

const read_list = (reader) => {
  const list = [];
  reader.next();

  while (reader.peek() !== ')') {
    if (reader.peek() === undefined) throw new Error('unbalanced');
    list.push(read_form(reader));
    reader.next();
  }

  return new MalList(list);
};

const read_vector = (reader) => {
  const vector = [];
  reader.next();

  while (reader.peek() !== ']') {
    if (reader.peek() === undefined) throw new Error('unbalanced');
    vector.push(read_form(reader));
    reader.next();
  }

  return new MalVector(vector);
};

const read_atom = (reader) => {
  const token = reader.peek();
  switch (true) {
    case typeof token === 'number':
      return new MalNumber(parseInt(token));
    default:
      return new MalSymbol(token);
  }
};

const read_form = (reader) => {
  const firstToken = reader.peek();
  switch (firstToken) {
    case '[':
      return read_vector(reader);
    case '(':
      return read_list(reader);
    default:
      return read_atom(reader);
  }
};

const read_str = (str) => {
  const tokens = tokenize(str);
  const reader = new Reader(tokens);
  return read_form(reader);
};

exports.read_str = read_str;
