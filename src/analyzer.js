import {
  Type,
  Function,
} from './ast.js'

import * as stdlib from './stdlib.js'

function must(condition, errorMessage) {
  if (!condition) {
    throw new Error(errorMessage)
  }
}

function getType(type) {
  switch (type) {
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

const check = self => ({
  HerdAccessIsAnna() {
    must(
      Type.ANNA === self.type,
      `Expected Anna, but found ${self.type.name}. Please summon Anna to get Sven from the Herd, good spirit!`
    )
  },
  isHerdOrAny() {
    must(
      [Type.HERD, Type.ANY].includes(self.type),
      `Expected a Herd, but found otherwise. Please summon the Herd, good spirit!`
    )
  },
  isTrollsOrAny() {
    must(
      [Type.TROLLS, Type.ANY].includes(self.type),
      `Expected the Trolls, but found otherwise. Please seek guidance from the Trolls, good spirit!`
    )
  },
  isNumeric() {
    must(
      [Type.ANNA, Type.ELSA, Type.ANY].includes(self.type),
      `Expected Anna or Elsa, but found ${self.type.name}. Please summon Anna or Elsa, good spirit!`
    )
  },
  isNumericOrStringOrBoolean() {
    must(
      [Type.ANNA, Type.ELSA, Type.OLAF, Type.LOVE, Type.ANY].includes(self.type),
      `Expected Anna, Elsa, Olaf, or Love, but found ${self.type.name}. Please summon Anna, Elsa, Olaf or some Love, good spirit!`
    )
  },
  isNumericOrString() {
    must(
      [Type.ANNA, Type.ELSA, Type.OLAF, Type.ANY].includes(self.type),
      `Expected Anna, Elsa or Olaf, but found ${self.type.name}. Please summon Anna, Elsa or Olaf, good spirit!`
    )
  },
  isBoolean() {
    must(
      [Type.ANY, Type.LOVE].includes(self.type),
      `Expected a Love, found ${self.type.name}`
    )
  },
  hasSameTypeAs(other) {
    must(
      other.type === undefined ||
      other.type === Type.ANY ||
      self.type === undefined ||
      self.type === Type.ANY ||
      self.type === other.type,
      'Excuse me old spirit, it appears that your declared variable type and your chosen expression are not the same! How embarrassing!'
    )
  },
  hasNoFunctionOrFunctionReturnTypeMatches(expression) {
    if (self.function !== null) {
      must(
        self.function.returnType === expression.type || expression.type === Type.ANY || self.function.returnType === Type.ANY,
        `You must return ${self.function.returnType.name}! You simply must bad spirit!`
      )
    }
  },
  nonDuplicateVariableDeclaration(name) {
    must(
      !self.sees(name),
      `Duplicate Variable Declaration: Your proposed variable declaration has already been declared, good spirit! Please choose another name!`
    )
  },
  hasNoFunctionOrFunctionReturnsSamantha() {
    must(
      self.function === null || self.function.returnType === Type.SAMANTHA,
      `You must return Samantha! You simply must bad spirit!`
    )
  },
  isMeltable(mutability) {
    must(
      mutability === "Meltable",
      `You cannot melt the permafrost bad spirit! It simply cannot melt!`
    )
  },
  isSnow(x, name) {
    must(
      Object.keys(x).length === 2 && x.name !== undefined && x.body !== undefined,
      `Bad spirit! Cannot create a new instance of '${name}' when there is no Snow!`
    )
  },
  inSnowUseFrozen() {
    must(
      self.isInClass(),
      `Bad Spirit! You cannot use Frozen if you are not in Snow!`
    )
  },
  isAccessible(source) {
    must(
      source !== undefined && source.type !== undefined && (source.type === Type.HERD || source.type === Type.TROLLS || source.type === Type.ANY),
      `Bad spirit!!! You can't access that value type. Seek the Trolls[[]], find a Herd[], get an instance of Snow, or be in Snow and use Frozen!`
    )
  }
})

class Context {
  constructor(parent = null, configuration = {}) {
    // Parent (enclosing scope) for static scope analysis
    this.parent = parent
    // All local declarations. Names map to variable declarations, types, and
    // function declarations
    this.locals = new Map()
    // Whether we are in a class, so that we know if the use of this is 
    // acceptable
    this.inClass = configuration.inClass ?? parent?.inClass ?? false
    this.classFields = new Map()
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
  isInClass() {
    return this.inClass
  }
  addField(name, entity) {
    this.classFields.set(name, entity)
  }
  add(name, entity) {
    // No shadowing! Prevent addition if id anywhere in scope chain!
    if (this.sees(name)) {
      let x = this.lookup(name)
      throw new Error(`Forgetful spirit! ${name} already declared!`)
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
    return new Context(this, configuration)
  }
  analyze(node) {
    return this[node.constructor.name](node)
  }
  Program(p) {
    p.instructions = this.analyze(p.instructions)
    return p
  }
  Variable(d) {
    d.expression = this.analyze(d.expression)
    d.type = getType(d.type)
    if (d.expression !== "❅") {
      check(d).hasSameTypeAs(d.expression)
    }
    check(this).nonDuplicateVariableDeclaration(d.name)
    this.add(d.name, d)
    return d
  }
  ReturnStatement(s) {
    s.expression = this.analyze(s.expression)
    if (s.expression.name !== undefined && s.expression.type === undefined) {
      let ret = this.lookup(s.expression.name)
      s.expression.type = ret.type
    }
    check(this).hasNoFunctionOrFunctionReturnTypeMatches(s.expression)
    return s
  }
  ShortReturnStatement(s) {
    check(this).hasNoFunctionOrFunctionReturnsSamantha()
    return s
  }
  Function(d) {
    d.returnType = this.analyze(d.returnType)
    d.returnType = getType(d.returnType)
    const f = (d.function = new Function(d.returnType, d.name, d.parameters, d.body))
    const childContext = this.newChild({ inLoop: false, forFunction: f })
    d.parameters = childContext.analyze(d.parameters)
    this.add(f.name, f)
    d.body = childContext.analyze(d.body)
    return d
  }
  Snow(c) {
    if (this.inLoop) {
      throw new Error(`Foolish Spirit! You cannot create a class within a Loop!`)
    }
    const childContext = this.newChild({ inClass: true })
    c.body = childContext.analyze(c.body)
    this.add(c.name, c)
    return c
  }
  Constructor(c) {
    c.returnType = Type.SAMANTHA
    c.name = "Constructor"
    const f = (c.function = new Function(c.returnType, c.name, c.parameters, c.body))
    const childContext = this.newChild({ inLoop: false, forFunction: f, inClass: true, })
    c.parameters = childContext.analyze(c.parameters)
    c.body = childContext.analyze(c.body)
    return c
  }
  Method(m) {
    m.returnType = this.analyze(m.returnType)
    m.returnType = getType(m.returnType)
    const f = (m.function = new Function(m.returnType, m.name, m.parameters, m.body))
    const childContext = this.newChild({ inLoop: false, forFunction: f, inClass: true })
    m.parameters = childContext.analyze(m.parameters)
    this.add(f.name, f)
    m.body = childContext.analyze(m.body)
    return m
  }
  Field(f) {
    f.field.originalName = f.field.name
    f.field.name = "Frozen." + f.field.name
    f.field = this.analyze(f.field)
    this.addField(f.field.originalName, f)
    return f
  }
  IfStatement(s) {
    for (let condition of s.condition) {
      condition = this.analyze(condition)
    }
    for (let body of s.body) {
      body = this.analyze(body)
    }
    s.alternate = this.analyze(s.alternate)
    let final = { elseIf: [] }
    for (let i = 0; i < s.condition.length; i++) {
      if (i === 0) {
        final.if = {
          condition: s.condition[i],
          body: s.body[i]
        }
      } else {
        let elif = {
          condition: s.condition[i],
          body: s.body[i]
        }
        final.elseIf.push(elif)
      }
    }
    final.else = {
      body: s.alternate
    }
    return final
  }
  WhileLoop(w) {
    w.expression = this.analyze(w.expression)
    if (w.expression.name !== undefined) {
      let x = this.lookup(w.expression.name)
      w.expression.type = x.type
    }
    const childContext = this.newChild({ inLoop: true, })
    w.body = childContext.analyze(w.body)
    return w
  }
  Access(a) {
    a.accessValue = this.analyze(a.accessValue)
    return a
  }
  ForLoop(f) {
    f.start = this.analyze(f.start)
    f.limit = this.analyze(f.limit)
    f.increment = this.analyze(f.increment)
    const childContext = this.newChild({ inLoop: true, })
    f.body = childContext.analyze(f.body)
    return f
  }
  SwitchStatement(s) {
    s.expression = this.analyze(s.expression)
    s.cases = this.analyze(s.cases)
    s.body = this.analyze(s.body)
    s.defaultCase = this.analyze(s.defaultCase)

    if (s.expression.name !== undefined) {
      let x = this.lookup(s.expression.name)
      s.expression.type = x.type
    }
    let y
    check(s.expression).isNumericOrStringOrBoolean()
    for (let ca of s.cases) {
      if (ca.name !== undefined) {
        y = this.lookup(ca.name)
        ca.type = y.type
      }
      check(ca).isNumericOrStringOrBoolean()
    }
    return s
  }
  NewInstance(n) {
    n.identifier = this.analyze(n.identifier)
    n.args = this.analyze(n.args)
    let x = this.lookup(n.identifier)
    let c = undefined
    check(this).isSnow(x, n.identifier)

    for (let s of x.body) {
      if (s.parameters !== undefined) {
        c = s
        break
      }
    }
    if (c !== undefined) {
      if (n.args[0].names.length > c.parameters.parameter.length) {
        throw new Error(`Excuse me old spirit, you have too many arguments to instantiate ${x.name}.`)
      }
      if (n.args[0].names.length < c.parameters.parameter.length) {
        throw new Error(`Excuse me old spirit, you have too few arguments to instantiate ${x.name}.`)
      }
      for (let i = 0; i < n.args[0].names.length; i++) {
        if (n.args[0].names[i].arg.type.name !== c.parameters.parameter[i].type.name) {
          throw new Error(`Excuse me old spirit, the type of your argument '${n.args[0].names[i].arg.value}' does not match the required type '${c.parameters.parameter[i].type.name}'.`)
        }
      }
    } else {
      throw new Error(`Excuse me forgetful spirit. Your instance has no constructor! How embarrassing!`)
    }
    return n
  }
  Array(a) {
    a.map(e => this.analyze(e))
    return a
  }
  ArrayExpression(a) {
    this.analyze(a.values)
    a.type = Type.HERD
    return a
  }
  Dictionary(d) {
    d.entries = this.analyze(d.entries)
    return d
  }
  DictionaryEntry(d) {
    d.key = this.analyze(d.key)
    d.value = this.analyze(d.value)
    if (d.key.name !== undefined) {
      let x = this.lookup(d.key.name)
      d.key.type = x.type
    }
    check(d.key).isNumericOrString()
    return d
  }
  DictionaryEntries(d) {
    d.entries = this.analyze(d.entries)
    return d
  }
  Parameter(p) {
    p.name = this.analyze(p.name)
    p.type = this.analyze(p.type)
    p.type = getType(p.type)
    this.add(p.name, p)
    return p
  }
  Parameters(p) {
    p.parameter = this.analyze(p.parameter)
    return p
  }
  Arguments(a) {
    for (let n of a.names) {
      n = this.analyze(n)
    }
    return a
  }
  Argument(a) {
    a.arg = this.analyze(a.arg)
    if (a.arg.name !== undefined) {
      this.lookup(a.arg.name)
    }
    return a
  }
  Incrementer(i) {
    let x = this.lookup(i.operand.name)
    check(x).isNumeric()
    return i
  }
  BreakStatement(s) {
    return s
  }
  PlainAssignment(a) {
    let e = this.analyze(a.expression)
    a.expression = this.analyze(a.expression)
    let v = this.analyze(a.variable)
    a.variable = this.analyze(a.variable)
    let x
    if (a.variable.name !== undefined) {
      x = this.lookup(a.variable.name)
      check(this).isMeltable(x.mutability)
      check(x).hasSameTypeAs(a.expression)
    } else if (a.variable.source !== undefined) {
      if (a.variable.source === "Frozen") {
        check(this).inSnowUseFrozen()
      }
    }
    return a
  }
  IncrementalAssignment(i) {
    i.variable = this.analyze(i.variable)
    i.operand = this.analyze(i.operand)
    return i
  }
  BinaryExpression(e) {
    e.left = this.analyze(e.left)
    e.right = this.analyze(e.right)
    if (e.left.name !== undefined) {
      let x = this.lookup(e.left.name)
      e.left.type = x.type
    }
    if (e.right.name !== undefined) {
      let y = this.lookup(e.right.name)
      e.right.type = y.type
    }
    if (["&&", "||"].includes(e.op)) {
      e.type = Type.LOVE
    }
    if (["+"].includes(e.op)) {
      check(e.left).isNumericOrString()
      check(e.right).isNumericOrString()
      if (e.left.type.name === e.right.type.name) {
        e.type = e.left.type
      } else if ((e.left.type.name === "Elsa" || e.left.type.name === "Anna") &&
        (e.right.type.name === "Elsa" || e.right.type.name === "Anna")) {
        e.type = Type.ELSA
      } else {
        e.type = Type.OLAF
      }
    } if (["-", "*", "/", "%", "**", "<", "<=", ">", ">=", "=="].includes(e.op)) {
      check(e.left).isNumeric()
      check(e.right).isNumeric()
      if (e.left.type.name === e.right.type.name && e.op !== "/") {
        e.type = e.left.type
      } else {
        e.type = Type.ELSA
      }
    }
    return e
  }
  UnaryExpression(e) {
    e.right = this.analyze(e.right)
    if (e.op === "-") {
      check(e.right).isNumeric()
      e.type = e.right.type
    } else if (e.op === "!") {
      check(e.right).isBoolean()
      e.type = Type.LOVE
    }
    return e
  }
  Identifier(i) {
    return i
  }
  GetProperty(p) {
    p.source = this.analyze(p.source)
    p.property = this.analyze(p.property)
    let x, name
    if (p.source.name !== undefined) {
      x = this.lookup(p.source.name)
      p.source.type = x.type
      name = p.source.name
    }
    if (p.source === "Frozen") {
      check(this).inSnowUseFrozen()
      name = p.source
    } else {
      check(this).isAccessible(p.source)
    }
    if (p.property[0].accessMethod === "[[]]") {
      check(p.source).isTrollsOrAny()
    } else if (p.property[0].accessMethod === "[]") {
      check(p.source).isHerdOrAny()
      if (p.property[0].accessValue.name !== undefined) {
        x = this.lookup(p.property[0].accessValue.name)
        p.property[0].accessValue.type = x.type
        check(p.property[0].accessValue).HerdAccessIsAnna()
      }
    } else if (p.source !== "Frozen") {
      check(p.source).isTrollsOrAny()
    }
    p.type = Type.ANY
    return p
  }
  Call(c) {
    c.name = this.analyze(c.name)
    c.args = this.analyze(c.args)
    if (c.name.name !== "Sing" && c.name.name !== undefined) {
      let call = this.lookup(c.name.name)
      if (c.args.length > call.parameters.parameter.length) {
        throw new Error(`Excuse me old spirit, you have too many arguments to call ${call.name}.`)
      }
      if (c.args.length < call.parameters.parameter.length) {
        throw new Error(`Excuse me old spirit, you have too few arguments to call ${call.name}.`)
      }
      for (let i = 0; i < c.args.length; i++) {
        if (c.args[i].arg.type.name !== call.parameters.parameter[i].type.name) {
          throw new Error(`Excuse me old spirit, the type of your argument '${c.args[i].arg.value}' does not match the required type '${call.parameters.parameter[i].type.name}'.`)
        }
      }
    }
    return c
  }
  String(s) {
    return s
  }
  Integer(i) {
    i.type = Type.ANNA
    return i
  }
  Float(f) {
    f.type = Type.ELSA
    return f
  }
  Phrase(s) {
    s.type = Type.OLAF
    return s
  }
  Booley(b) {
    b.type = Type.LOVE
    return b
  }
}

export default function analyze(node) {
  const initialContext = new Context()
  const library = { ...stdlib.types, ...stdlib.constants, ...stdlib.functions }
  for (const [name, type] of Object.entries(library)) {
    initialContext.add(name, type)
  }
  return initialContext.analyze(node)
}