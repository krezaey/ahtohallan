import {
  Variable,
  Type,
  Function,
  ArrayType,
  DictionaryType,
  FunctionType,
  ClassType
} from "./ast.js"

import * as stdlib from "./stdlib.js"

function must(condition, errorMessage) {
  if (!condition) {
    throw new Error(errorMessage)
  }
}

Object.assign(Type.prototype, {
  isEquivalentTo(target) {
    return this == target
  },
  isAssignableTo(target) {
    return this.isEquivalentTo(target)
  },
})

Object.assign(ArrayType.prototype, {
  isEquivalentTo(target) {
    return (
      target.constructor === ArrayType
    )
  },
  isAssignableTo(target) {
    return this.isEquivalentTo(target)
  },
})

Object.assign(DictionaryType.prototype, {
  isEquivalentTo(target) {
    return (
      target.constructor === DictionaryType
    )
  },
  isAssignableTo(target) {
    return this.isEquivalentTo(target)
  }
})

Object.assign(FunctionType.prototype, {
  isEquivalentTo(target) {
    return (
      target.constructor === FunctionType &&
      this.returnType.isEquivalentTo(target.returnType) &&
      this.parameterTypes.length === target.parameterTypes.length &&
      this.parameterTypes.every((t, i) => target.parameterTypes[i].isEquivalentTo(t))
    )
  },
  isAssignableTo(target) {
    // Functions are covariant on return types, contravariant on parameters.
    return (
      target.constructor === FunctionType &&
      this.returnType.isAssignableTo(target.returnType) &&
      this.parameterTypes.length === target.parameterTypes.length &&
      this.parameterTypes.every((t, i) => target.parameterTypes[i].isAssignableTo(t))
    )
  },
})

Object.assign(ClassType.prototype, {
  isEquivalentTo(target) {
    // We're restrictive: requiring the same exact type object for equivalence
    return this == target
  },
  isAssignableTo(target) {
    // We're restrictive: requiring the same exact type object for assignment
    return this.isEquivalentTo(target)
  },
})

const check = self => ({
  isNumeric() {
    must(
      [Type.INT, Type.FLOAT].includes(self.type),
      `Expected a number, found ${self.type.name}`
    )
  },
  isNumericOrString() {
    must(
      [Type.INT, Type.FLOAT, Type.STRING].includes(self.type),
      `Expected a number or string, found ${self.type.name}`
    )
  },
  isBoolean() {
    must(self.type === Type.BOOLEAN, `Expected a Love, found ${self.type.name}`)
  },
  isInteger() {
    must(self.type === Type.INT, `Expected an Anna, found ${self.type.name}`)
  },
  isAType() {
    must(self instanceof Type, "Type expected")
  },
  isAnArray() {
    must(self.type.constructor === ArrayType, "Herd[] expected")
  },
  isADictionary() {
    must(self.type.constructor === DictionaryType, "Trolls[[]] expected")
  },
  hasSameTypeAs(other) {
    must(self.type.isEquivalentTo(other.type), "Operands do not have the same type")
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
    must(!self.readOnly, `Cannot melt an Unmeltable ${self.name}`)
  },
  areAllDistinct() {
    must(new Set(self.map(f => f.name)).size === self.length, "Snowflakes must be distinct")
  },
  isInTheObject(object) {
    must(object.type.fields.map(f => f.name).includes(self), "No such Snowflake")
  },
  isCallable() {
    must(
      self.constructor === ClassType || self.type.constructor == FunctionType,
      "Call of non-function or non-constructor"
    )
  },
  returnsNothing() {
    must(self.type.returnType === Type.VOID, `${self.type.returnType} should be returned here`)
  },
  returnsSomething() {
    must(self.type.returnType !== Type.VOID, "Cannot return a value here. It is Samantha!")
  },
  isReturnableFrom(f) {
    check(self).isAssignableTo(f.type.returnType)
  },
  match(targetTypes) {
    must(
      targetTypes.length === self.length,
      `${targetTypes.length} argument(s) required but ${self.length} passed`
    )
    targetTypes.forEach((type, i) => check(self[i]).isAssignableTo(type))
  },
  matchParametersOf(calleeType) {
    check(self).match(calleeType.parameterTypes)
  },
  matchFieldsOf(classType) {
    check(self).match(classType.fields.map(f => f.type))
  },
})

class Context {
  constructor(parent = null, configuration = {}) {
    // Parent (enclosing scope) for static scope analysis
    this.parent = parent
    // All local declarations. Names map to variable declarations, types, and
    // function declarations
    this.locals = new Map()
    // Whether we are in a loop, so that we know whether breaks and continues
    // are legal here
    this.inLoop = configuration.inLoop ?? parent?.inLoop ?? false
    // Whether we are in a function, so that we know whether a return
    // statement can appear here, and if so, how we typecheck it
    this.function = configuration.forFunction ?? parent?.function ?? null
  }
  sees(name) {
    // Search "outward" through enclosing scopes
    return this.locals.has(name) || this.parent?.sees(name)
  }
  add(name, entity) {
    // No shadowing! Prevent addition if id anywhere in scope chain!
    if (this.sees(name)) {
      throw new Error(`Identifier ${name} already declared`)
    }
    this.locals.set(name, entity)
  }
  lookup(name) {
    const entity = this.locals.get(name)
    if (entity) {
      return entity
    } else if (this.parent) {
      return this.parent.lookup(name)
    }
    throw new Error(`Identifier ${name} not declared`)
  }
  newChild(configuration = {}) {
    // Create new (nested) context, which is just like the current context
    // except that certain fields can be overridden
    return new Context(this, configuration)
  }
  analyze(node) {
    return this[node.constructor.name](node)
  }
  Program(p) {
    p.statements = this.analyze(p.statements)
    return p
  }
  Variable(d) {
    d.expression = this.analyze(d.expression)
    d.variable = new Variable(d.mutibility, d.type, d.name, d, expression)
    check(d.type.hasSameTypeAs(d.expression.type))
    d.variable.type = d.expression.type
    this.add(d.variable.name, d.variable)
    return d
  }
  ReturnStatement(s) {
    check(this.function.returnsSomething())
    s.expression = this.analyze(expression)
    check(s.expression).isReturnableFrom(this.function)
    return s
  }
  // Expression(e) {}
  Function(f) {
    d.returnType = d.returnType ? this.analyze(d.returnType) : Type.VOID
    check(d.returnType).isAType()
    // Declarations generate brand new function objects
    const f = (d.function = new Function(d.returnType, d.name, d.parameters, d.body))
    // When entering a function body, we must reset the inLoop setting,
    // because it is possible to declare a function inside a loop!
    const childContext = this.newChild({ inLoop: false, forFunction: f })
    d.parameters = childContext.analyze(d.parameters)
    f.type = new FunctionType(
      d.parameters.map(p => p.type),
      d.returnType
    )
    // Add before analyzing the body to allow recursion
    this.add(f.name, f)
    d.body = childContext.analyze(d.body)
    return d
  }
  Class(c) {

  }
  Constructor(c) {

  }
  Method(m) {

  }
  Field(f) {

  }
  IfStatement(s) {

  }
  WhileLoop(w) {

  }
  Access(a) {

  }
  ForLoop(f) {

  }
  SwitchStatement(s) {

  }
  NewInstance(n) {

  }
  Array(a) {

  }
  Dictionary(d) {

  }
  DictionaryEntry(d) {

  }
  DictionaryEntries(d) {

  }
  Parameter(p) {

  }
  Parameters(p) {

  }
  Arguments(a) {

  }
  Incrementer(i) {

  }
  PlainAssignment(p) {

  }
  IncrementalAssignment(i) {

  }
  Relation(r) {

  }
  Expression2_logicalop(e) {

  }
  Expression4_addop(e) {

  }
  Expression5_mulop(e) {

  }
  Expression6_exp(e) {

  }
  Expression6_negop(e) {

  }
  Expression9_prefixop(e) {

  }
  Identifier(i) {

  }
  GetProperty(p) {

  }
  Call(c) {

  }
}

export default function analyze(node) {
  // Allow primitives to be automatically typed

  //ADD ALL PRIMITIVES HERE
  const initialContext = new Context()

  // Add in all the predefined identifiers from the stdlib module
  const library = { ...stdlib.types, ...stdlib.constants, ...stdlib.functions }
  for (const [name, type] of Object.entries(library)) {
    initialContext.add(name, type)
  }
  return initialContext.analyze(node)
}