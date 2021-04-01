import {
  Variable,
  Type,
  Function,
  // ArrayType,
  DictionaryType,
  FunctionType,
  ClassType,
} from './ast.js';

import * as stdlib from './stdlib.js';

import util from 'util';
import { Console } from 'console';

// Unmeltable Herd[] x = [[[[1]]]] ❅ 
// Sing(x[0][0][0][0] + 2) ❅


function must(condition, errorMessage) {
  if (!condition) {
    throw new Error(errorMessage);
  }
}

function getType(type) {
  switch(type) {
    case "Anna":
      return Type.ANNA
    case "Elsa":
      return Type.ELSA
    case "Olaf":
      return Type.OLAF
    case "Samantha":
      return Type.SAMANTHA
    case "Love":
      return Type.LOVE
    case "Herd[]":
      return Type.HERD
    case "Trolls[[]]":
      return Type.TROLLS
    default:
      return Type.ANY
  }
}

Object.assign(Type.prototype, {
  isEquivalentTo(target) {
    return this == target;
  },
  isAssignableTo(target) {
    return this.isEquivalentTo(target);
  },
});

Object.assign(Type.HERD, {
  isEquivalentTo(target) {
    return target.constructor === Type.HERD;
  },
  isAssignableTo(target) {
    return this.isEquivalentTo(target);
  },
});

Object.assign(DictionaryType.prototype, {
  isEquivalentTo(target) {
    return target.constructor === DictionaryType;
  },
  isAssignableTo(target) {
    return this.isEquivalentTo(target);
  },
});

Object.assign(FunctionType.prototype, {
  isEquivalentTo(target) {
    return (
      target.constructor === FunctionType &&
      this.returnType.isEquivalentTo(target.returnType) &&
      this.parameterTypes.length === target.parameterTypes.length &&
      this.parameterTypes.every((t, i) => target.parameterTypes[i].isEquivalentTo(t))
    );
  },
  isAssignableTo(target) {
    // Functions are covariant on return types, contravariant on parameters.
    return (
      target.constructor === FunctionType &&
      this.returnType.isAssignableTo(target.returnType) &&
      this.parameterTypes.length === target.parameterTypes.length &&
      this.parameterTypes.every((t, i) => target.parameterTypes[i].isAssignableTo(t))
    );
  },
});

Object.assign(ClassType.prototype, {
  isEquivalentTo(target) {
    // We're restrictive: requiring the same exact type object for equivalence
    return this == target;
  },
  isAssignableTo(target) {
    // We're restrictive: requiring the same exact type object for assignment
    return this.isEquivalentTo(target);
  },
});

const check = self => ({
  isNumeric() {
    console.log(self)
    must([Type.ANNA, Type.ELSA].includes(self.type), `Expected Anna or Elsa, but found ${self.type.name}. Please summon Anna or Elsa, good spirit!`);
  },
  isNumericOrString() {
    must(
      [Type.ANNA, Type.ELSA, Type.OLAF].includes(self.type),
      `Expected a number or string, found ${self.type.name}`
    );
  },
  isBoolean() {
    must(self.type === Type.LOVE, `Expected a Love, found ${self.type.name}`);
  },
  isInteger() {
    must(self.type === Type.ANNA, `Expected an Anna, found ${self.type.name}`);
  },
  isAType() {
    must(self instanceof Type, 'Type expected');
  },
  isAnArray() {
    must(self.type.constructor === Type.HERD, 'Herd[] expected');
  },
  isADictionary() {
    must(self.type.constructor === DictionaryType, 'Trolls[[]] expected');
  },
  hasSameTypeAs(other) {
    must(self.type === undefined ||
      other.type === undefined ||
      self.type.name === other.type.name,
      'Excuse me old spirit, it appears that your declared variable type and your chosen expression are not the same! How embarrassing!');
  },
  // allHaveSameType() {
  //   must(
  //     self.slice(1).every(e => e.type.isEquivalentTo(self[0].type)),
  //     "Not all elements have the same type"
  //   )
  // },
  // isAssignableTo(type) {
  //   must(
  //     type === Type.ANY || self.type.isAssignableTo(type),
  //     `Cannot assign a ${self.type.name} to a ${type.name}`
  //   )
  // },
  isNotReadOnly() {
    must(!self.readOnly, `Cannot melt an Unmeltable ${self.name}`);
  },
  areAllDistinct() {
    must(new Set(self.map(f => f.name)).size === self.length, 'Snowflakes must be distinct');
  },
  isInTheObject(object) {
    must(object.type.fields.map(f => f.name).includes(self), 'No such Snowflake');
  },
  isCallable() {
    must(
      self.constructor === ClassType || self.type.constructor == FunctionType,
      'Call of non-function or non-constructor'
    );
  },
  returnsNothing() {
    must(self.type.returnType === Type.SAMANTHA, `${self.type.returnType} should be returned here`);
  },
  returnsSomething() {
    must(self.type.returnType !== Type.SAMANTHA, 'Cannot return a value here. It is Samantha!');
  },
  hasNoFunctionOrFunctionReturnTypeMatches(expression) {
    if (expression.name !== undefined) {
      // if returning a identifier, find it and check its type
      if (self.sees(expression.name)) {
        let exp = self.lookup(expression.name)
        must(self.function == null || self.function.returnType === exp.type,
          `Type error: Your proposed return type and actual return type must match, good spirit!`)
      }
    } else {
      // returning an immediate expression value
      must(
        self.function == null || self.function.returnType === expression.type.name,
        `Type error: Your proposed return type and actual return type must match, good spirit!`
      );
    }
  },
  nonDuplicateVariableDeclaration(name) {
    must(!self.sees(name), `Duplicate Variable Declaration: Your proposed variable declaration has already been declared, good spirit! Please choose another name!`)
  },
  hasNoFunctionOrFunctionReturnsSamantha() {
    // TODO: Later make the type a "real" type
    // console.log(self.function.returnType);
    must(
      self.function === null || self.function.returnType === 'Samantha',
      `You must return the correct type! You simply must bad spirit!`
    );
  },
  isMeltable(mutability) {
    must(
      mutability === "Meltable", `You cannot melt the permafrost bad spirit! It simply cannot melt!`)
  },
  isReturnableFrom(f) {
    check(self).isAssignableTo(f.type.returnType);
  },
  match(targetTypes) {
    must(
      targetTypes.length === self.length,
      `${targetTypes.length} argument(s) required but ${self.length} passed`
    );
    targetTypes.forEach((type, i) => check(self[i]).isAssignableTo(type));
  },
  matchParametersOf(calleeType) {
    check(self).match(calleeType.parameterTypes);
  },
  matchFieldsOf(classType) {
    check(self).match(classType.fields.map(f => f.type));
  },
});

class Context {
  constructor(parent = null, configuration = {}) {
    // Parent (enclosing scope) for static scope analysis
    this.parent = parent;
    // All local declarations. Names map to variable declarations, types, and
    // function declarations
    this.locals = new Map();
    // Whether we are in a loop, so that we know whether breaks and continues
    // are legal here
    this.inLoop = configuration.inLoop ?? parent?.inLoop ?? false;
    // Whether we are in a function, so that we know whether a return
    // statement can appear here, and if so, how we typecheck it
    this.function = configuration.forFunction ?? parent?.function ?? null;
  }
  sees(name) {
    // Search "outward" through enclosing scopes
    return this.locals.has(name) || this.parent?.sees(name);
  }
  add(name, entity) {
    // No shadowing! Prevent addition if id anywhere in scope chain!
    if (this.sees(name)) {
      throw new Error(`Identifier ${name} already declared`);
    }
    this.locals.set(name, entity);
  }
  lookup(name) {
    const entity = this.locals.get(name);
    if (entity) {
      return entity;
    } else if (this.parent) {
      return this.parent.lookup(name);
    }
    throw new Error(`Identifier ${name} not declared`);
  }
  newChild(configuration = {}) {
    // Create new (nested) context, which is just like the current context
    // except that certain fields can be overridden
    return new Context(this, configuration);
  }
  analyze(node) {
    console.log(`About to analyze a ${node.constructor.name}`);
    return this[node.constructor.name](node);
  }
  Program(p) {
    p.instructions = this.analyze(p.instructions);
    return p;
  }
  Variable(d) {
    let x = this.analyze(d.expression)
    d.expression = x === undefined ? d.expression : x
    // console.log("hakdhkadbhfka", d.expression)
    console.log(d.expression)

    check(d).hasSameTypeAs(d.expression);

    console.log(Type)

    // d.type = Type[d.type]
    // console.log(d)
    // console.log("hakdhkadbhfka", d.expression)
    check(this).nonDuplicateVariableDeclaration(d.name)
    // console.log(d.name)
    console.log("Dat big D", d)
    this.add(d.name, d)
    // console.log('Got var');
    return d;
  }
  ReturnStatement(s) {
    // Check if type of return expression value is the same as the type of the function if the function exists    s.exp = this.analyze(s.expression);
    // console.log(util.inspect(this, { depth: 8 }));
    check(this).hasNoFunctionOrFunctionReturnTypeMatches(s.expression);
    // check(s.expression).isReturnableFrom(this.function);
    return s;
  }
  ShortReturnStatement(s) {
    // TODO: Check that (1) the current function has return type Samantha or
    // (2) that there is no current function (we're at the top level)
    check(this).hasNoFunctionOrFunctionReturnsSamantha();
    return s;
  }
  // Expression(e) {}
  Function(d) {
    d.returnType = d.returnType ? this.analyze(d.returnType) : Type.SAMANTHA;
    //check(d.returnType).isAType(); <---- DO LATER
    // Declarations generate brand new function objects
    const f = (d.function = new Function(d.returnType, d.name, d.parameters, d.body));
    // When entering a function body, we must reset the inLoop setting,
    // because it is possible to declare a function inside a loop!
    const childContext = this.newChild({ inLoop: false, forFunction: f });
    d.parameters = childContext.analyze(d.parameters);
    // f.type = new FunctionType(
    //   d.parameters.map(p => p.type),
    //   d.returnType
    // );
    // Add before analyzing the body to allow recursion
    this.add(f.name, f);
    d.body = childContext.analyze(d.body);
    return d;
  }
  Class(c) {
    this.add(c.name, c);
    const childContext = this.newChild({ inLoop: false, })
    c.body = childContext.analyze(c.body);
    return c;
  }
  Constructor(c) {
    this.add(c.name, c);
  }
  Method(m) { }
  Field(f) {

    f.field = this.analyze(f.field);
    // console.log(f.field)
    return f;
  }
  IfStatement(s) {  }
  WhileLoop(w) {
    const childContext = this.newChild({ inLoop: false, })
    w.body = childContext.analyze(w.body);
    return w
  }
  Access(a) { }
  ForLoop(f) { }
  SwitchStatement(s) { }
  NewInstance(n) { }
  Array(a) {
    a.map(e => this.analyze(e));
    // console.log(util.inspect(a, {depth: 7}))
    return a;
  }
  ArrayExpression(a) {
    this.analyze(a.values);
    a.type = Type.HERD
    return a
  }
  Dictionary(d) { }
  DictionaryEntry(d) { }
  DictionaryEntries(d) { }
  Parameter(p) {
    this.add(p.name, p)
    return p;
  }
  Parameters(p) {
    p.parameter = this.analyze(p.parameter);
    return p;
  }
  Arguments(a) { }
  Incrementer(i) {
    let x = this.lookup(i.operand.name);
    console.log("x", x)
    check(x).isNumeric();
    return i;
  }
  BreakStatement(s) {
    return s;
  }
  PlainAssignment(a) {
    a.expression = this.analyze(a.expression);
    let x = this.lookup(a.variable.name);
    check(this).isMeltable(x.mutability);
    // check if a.variable already exist because it should
    // TODO check(d.type.hasSameTypeAs(a.expression.type));
    console.log('Got var');
    return a;
  }
  IncrementalAssignment(i) { }
  Relation(r) { }
//   BinaryExpression(e) {
//     return e
//   }


  BinaryExpression(e) {
    e.left = this.analyze(e.left);
    e.right = this.analyze(e.right);
    if (["&", "|", "^", "<<", ">>"].includes(e.op)) {
      check(e.left).isInteger();
      check(e.right).isInteger();
      e.type = Type.ANNA
    //} 
      // else if (["+"].includes(e.op)) {
      // check(e.left).isNumericOrString();
      // check(e.left).hasSameTypeAs(e.right);
      // e.type = e.left.type;
    } if (["-", "*", "/", "%", "**"].includes(e.op)) {
      check(e.left).isNumeric();
      check(e.left).hasSameTypeAs(e.right);
      e.type = e.left.type;
    } 
    //else if (["<", "<=", ">", ">="].includes(e.op)) {
    //   check(e.left).isNumericOrString();
    //   check(e.left).hasSameTypeAs(e.right);
    //   e.type = Type.LOVE
    // } else if (["==", "!="].includes(e.op)) {
    //   check(e.left).hasSameTypeAs(e.right);
    //   e.type = Type.LOVE;
    // }
    return e;
  }

  UnaryExpression(e) {
    e.operand = this.analyze(e.operand);
    if (e.op === "-") {
      check(e.operand).isNumeric()
      e.type = e.operand.type;
    } else if (e.op === "!=") {
      check(e.operand).isBoolean()
      e.type = Type.LOVE;
    } else if (e.op === "!=") {
      check(e.operand).isBoolean()
      e.type = Type.LOVE;
    } else {
      // Operator is "some"
      e.type = new OptionalType(e.operand.type);
    }
    return e;
  }

  // UnaryExpression(e) {
  //   e.operand = this.analyze(e.operand)
  //   if (e.op === "#") {
  //     check(e.operand).isAnArray()
  //     e.type = Type.INT
  //   } else if (e.op === "-") {
  //     check(e.operand).isNumeric()
  //     e.type = e.operand.type
  //   } else if (e.op === "!") {
  //     check(e.operand).isBoolean()
  //     e.type = Type.BOOLEAN
  //   } else {
  //     // Operator is "some"
  //     e.type = new OptionalType(e.operand.type)
  //   }
  //   return e
  // }
  Identifier(i) { }
  GetProperty(p) { }
  Call(c) { }
  Number(n) {
    return n;
  }
  String(s) {
    return s;
  }
  Integer(i) {
    i.type = Type.ANNA;
    return i;
  }
  Float(f) {
    f.type = Type.ELSA;
    return f;
  }
  Phrase(s) {
    s.type = Type.OLAF;
    return s;
  }
  Booley(b) {
    b.type = Type.LOVE;
    return b;
  }
}

export default function analyze(node) {
  // Allow primitives to be automatically typed

  //ADD ALL PRIMITIVES HERE
  const initialContext = new Context();

  // Add in all the predefined identifiers from the stdlib module
  const library = { ...stdlib.types, ...stdlib.constants, ...stdlib.functions };
  for (const [name, type] of Object.entries(library)) {
    initialContext.add(name, type);
  }
  return initialContext.analyze(node);
}
