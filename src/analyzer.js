import {
  Variable,
  Type,
  Function,
  // ArrayType,
  DictionaryType,
  FunctionType,
  ClassType,
} from './ast.js'

import * as stdlib from './stdlib.js'
import util from 'util'
import { Console } from 'console'
import { type } from 'os'

function must(condition, errorMessage) {
  if (!condition) {
    throw new Error(errorMessage)
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
  // isEquivalentTo(target) {
  //   return this == target
  // },
  // isAssignableTo(target) {
  //   return this.isEquivalentTo(target)
  // },
})

Object.assign(Type.HERD, {
  // isEquivalentTo(target) {
  //   return target.constructor === Type.HERD
  // },
  // isAssignableTo(target) {
  //   return this.isEquivalentTo(target)
  // },
})

// Object.assign(DictionaryType.prototype, {
  // isEquivalentTo(target) {
  //   return target.constructor === DictionaryType
  // },
  // isAssignableTo(target) {
  //   return this.isEquivalentTo(target)
  // },
// })

Object.assign(FunctionType.prototype, {
  // isEquivalentTo(target) {
  //   return (
  //     target.constructor === FunctionType &&
  //     this.returnType.isEquivalentTo(target.returnType) &&
  //     this.parameterTypes.length === target.parameterTypes.length &&
  //     this.parameterTypes.every((t, i) => target.parameterTypes[i].isEquivalentTo(t))
  //   )
  // },
  // isAssignableTo(target) {
    // Functions are covariant on return types, contravariant on parameters.
    // return (
    //   target.constructor === FunctionType &&
    //   this.returnType.isAssignableTo(target.returnType) &&
    //   this.parameterTypes.length === target.parameterTypes.length &&
    //   this.parameterTypes.every((t, i) => target.parameterTypes[i].isAssignableTo(t))
    // )
  // },
})

Object.assign(ClassType.prototype, {
  // isEquivalentTo(target) {
  //   // We're restrictive: requiring the same exact type object for equivalence
  //   return this == target
  // },
  // isAssignableTo(target) {
  //   // We're restrictive: requiring the same exact type object for assignment
  //   return this.isEquivalentTo(target)
  // },
})

const check = self => ({
  isNumeric() {
    //console.log(self.type)

    must(self.type.name === "Anna" || self.type.name === "Elsa", `Expected Anna or Elsa, but found ${self.type.name}. Please summon Anna or Elsa, good spirit!`)
  },
  isNumericOrString() {
    must(
      [Type.ANNA, Type.ELSA, Type.OLAF].includes(self.type),
      `Expected Anna, Elsa or Olaf, but found ${self.type.name}. Please summon Anna, Elsa or Olaf, good spirit!`
    )
  },
  isBoolean() {
    must(self.type === Type.LOVE, `Expected a Love, found ${self.type.name}`)
  },
  // isInteger() {
  //   must(self.type === Type.ANNA, `Expected an Anna, found ${self.type.name}`)
  // },
  // isAType() {
  //   must(self instanceof Type, 'Type expected')
  // },
  // isAnArray() {
  //   must(self.type.constructor === Type.HERD, 'Herd[] expected')
  // },
  // isADictionary() {
  //   must(self.type.constructor === Type.TROLLS, 'Trolls[[]] expected')
  // },
  hasSameTypeAs(other) {
    // console.log("moi", self)
    // console.log("moi", self.type)
    // console.log("mes ami", other.type)
    must(self.type === undefined ||
      other.type === undefined ||
      self.type.name === other.type.name,
      'Excuse me old spirit, it appears that your declared variable type and your chosen expression are not the same! How embarrassing!')
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
  // isNotReadOnly() {
  //   must(!self.readOnly, `Cannot melt an Unmeltable ${self.name}`)
  // },
  // areAllDistinct() {
  //   must(new Set(self.map(f => f.name)).size === self.length, 'Snowflakes must be distinct')
  // },
  // isInTheObject(object) {
  //   must(object.type.fields.map(f => f.name).includes(self), 'No such Snowflake')
  // },
  // isCallable() {
  //   must(
  //     self.constructor === ClassType || self.type.constructor == FunctionType,
  //     'Call of non-function or non-constructor'
  //   )
  // },
  // returnsNothing() {
  //   must(self.type.returnType === Type.SAMANTHA, `${self.type.returnType} should be returned here`)
  // },
  // returnsSomething() {
  //   must(self.type.returnType !== Type.SAMANTHA, 'Cannot return a value here. It is Samantha!')
  // },
  hasNoFunctionOrFunctionReturnTypeMatches(expression) {
    console.log("Ret Type: ", self.function.returnType)
    console.log("Expression Type: ", expression.type)
    must(
      self.function == null || self.function.returnType === expression.type,
      `Type error: Your proposed return type and actual return type must match, good spirit!`
    )
  },
  nonDuplicateVariableDeclaration(name) {
    must(!self.sees(name), `Duplicate Variable Declaration: Your proposed variable declaration has already been declared, good spirit! Please choose another name!`)
  },
  hasNoFunctionOrFunctionReturnsSamantha() {
    // TODO: Later make the type a "real" type

    must(
      self.function === null || self.function.returnType === 'Samantha',
      `You must return the correct type! You simply must bad spirit!`
    )
  },
  isMeltable(mutability) {
    must(
      mutability === "Meltable", `You cannot melt the permafrost bad spirit! It simply cannot melt!`)
  },
  // isReturnableFrom(f) {
  //   check(self).isAssignableTo(f.type.returnType)
  // },
  isAccessible(source) {
    // TODO : Make Frozen(this) have the type TROLLS[[]]
    must(source !== undefined || source.type !== undefined || source.type.name === Type.HERD.name || source.type.name === Type.TROLLS.name, `Bad spirit!!! You can't access that value type. Seek the Trolls[[]] or find a Herd[]!`)
  },
  // match(targetTypes) {
  //   must(
  //     targetTypes.length === self.length,
  //     `${targetTypes.length} argument(s) required but ${self.length} passed`
  //   )
  //   targetTypes.forEach((type, i) => check(self[i]).isAssignableTo(type))
  // },
  // matchParametersOf(calleeType) {
  //   check(self).match(calleeType.parameterTypes)
  // },
  // matchFieldsOf(classType) {
  //   check(self).match(classType.fields.map(f => f.type))
  // },
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
    // Create new (nested) context, which is just like the current context
    // except that certain fields can be overridden
    return new Context(this, configuration)
  }
  analyze(node) {
    console.log(`About to analyze a ${node.constructor.name}`)
    return this[node.constructor.name](node)
  }
  Program(p) {
    p.instructions = this.analyze(p.instructions)
    return p
  }
  Variable(d) {
    let x = this.analyze(d.expression)
    d.expression = x === undefined ? d.expression : x
    d.type = getType(d.type)
    check(d).hasSameTypeAs(d.expression)
    // d.type = Type[d.type]
    // console.log(d)
    // console.log("hakdhkadbhfka", d.expression)
    check(this).nonDuplicateVariableDeclaration(d.name)
    // console.log(d.name)
    console.log(d.name)
    this.add(d.name, d)
    // console.log('Got var')
    return d
  }
  ReturnStatement(s) {
    // Check if type of return expression value is the same as the type of the function if the function exists    s.exp = this.analyze(s.expression)
    // console.log(util.inspect(this, { depth: 8 }))
    let x = this.analyze(s.expression)
    s.expression = x!== undefined? x : s.expression
    if (s.expression.name !== undefined) {
      let ret = this.lookup(s.expression.name)
      s.expression.type = getType(ret.type);
    }

    check(this).hasNoFunctionOrFunctionReturnTypeMatches(s.expression)
    // check(s.expression).isReturnableFrom(this.function)
    return s
  }
  ShortReturnStatement(s) {
    // TODO: Check that (1) the current function has return type Samantha or
    // (2) that there is no current function (we're at the top level)
    check(this).hasNoFunctionOrFunctionReturnsSamantha()
    return s
  }
  // Expression(e) {}
  Function(d) {
    console.log(d.returnType)
    d.returnType = d.returnType ? this.analyze(d.returnType) : Type.SAMANTHA
    d.returnType = getType(d.returnType)
    console.log(d.returnType)
    //check(d.returnType).isAType() <---- DO LATER
    // Declarations generate brand new function objects
    const f = (d.function = new Function(d.returnType, d.name, d.parameters, d.body))
    // When entering a function body, we must reset the inLoop setting,
    // because it is possible to declare a function inside a loop!
    const childContext = this.newChild({ inLoop: false, forFunction: f })
    d.parameters = childContext.analyze(d.parameters)
    // f.type = new FunctionType(
    //   d.parameters.map(p => p.type), d.returnType
    // )
    // Add before analyzing the body to allow recursion
    this.add(f.name, f)
    d.body = childContext.analyze(d.body)
    return d
  }
  Snow(c) {
    if (this.inLoop) {
      throw new Error(`Foolish Spirit! You cannot create a class within a Loop!`)
    }
    // console.log(c.name)
    this.add(c.name, c)
    const childContext = this.newChild({ inLoop: false, })
    c.body = childContext.analyze(c.body)
    let that = {
      name: "this",
      type: Type.HERD,
      reference: c
    }
    this.add("this", that)
    return c
  }
  Constructor(c) {
    this.add(c.name, c)
  }
  Method(m) {
    m.returnType = m.returnType ? this.analyze(m.returnType) : m.returnType
    m.returnType = getType(m.returnType)
    const f = (m.function = new Function(m.returnType, m.name, m.parameters, m.body))
    // When entering a function body, we must reset the inLoop setting,
    // because it is possible to declare a function inside a loop!
    const childContext = this.newChild({ inLoop: false, forFunction: f })
    m.parameters = childContext.analyze(m.parameters)
    // f.type = new FunctionType(
    //   d.parameters.map(p => p.type),
    //   d.returnType
    // )
    // Add before analyzing the body to allow recursion
    this.add(f.name, f)
    m.body = childContext.analyze(m.body)
    return m
  }
  Field(f) {
    f.field = this.analyze(f.field)
    // console.log(f.field)
    return f
  }
  IfStatement(s) {
    // analyze all of the condtions
    for (let condition of s.condition) {
      let c = this.analyze(condition)
      condition = c !== undefined ? c: condition
    }
    // analyze all of the bodies
    for (let body of s.body) {
      let b = this.analyze(body)
      body = b !== undefined ? b: body
    }
    // analyze the else block
    let e = this.analyze(s.alternate)
    s.alternate = e !== undefined ? e : s.alternate
    
    // recombine all of the blocks appropriately
    let final = {elseIf: []}
    for (let i = 0; i < s.condition.length; i++) {
      if (i === 0) {
        // if case
        final.if = {
          condition: s.condition[i],
          body : s.body[i]
        }
      } else {
        // else if cases
        let elif = {
          condition: s.condition[i],
          body : s.body[i]
        }
        final.elseIf.push(elif)
      } 
    }
    final.else = {
      body : s.alternate
    }
    return final
  }
  WhileLoop(w) {
    let e = this.analyze(w.expression)
    w.expression = e !== undefined? e : w.expression
    const childContext = this.newChild({ inLoop: true, })
    w.body = childContext.analyze(w.body)
    return w
  }
  // Access(a) {
  //   let v = this.analyze(a.accessValue)
  //   a.accessValue = v !== undefined ? v : a.accessValue
  //   return a
  // }
  ForLoop(f) {
    // ForLoop = for "("Variable Relation terminal Increment ")" Body
    let s = this.analyze(f.start)
    f.start = s !== undefined ? s : f.start
    let l = this.analyze(f.limit)
    f.limit = l !== undefined ? l : f.limit
    // let i = this.analyze(f.increment)
    // f.increment = i !== undefined ? i : f.increment
    // let b = this.analyze(f.body)
    // f.body = b !== undefined ? b : f.body
    
    console.log("For Loop Baabys: ", util.inspect(f, {depth : 8}))
    // constructor(start, limit, increment, body) {
   }
  SwitchStatement(s) {
   // SwitchStatement = switch "(" Expression ")" "{" (case "(" typeValue ")" ":" Statement* )+ (default ":" Statement*)? "}"
   // constructor(expression, cases, body, defaultCase)
   /*
   
   let e = this.analyze(s.expression)  // dont think we need all of this but lets see
   let c = this.anaylze(s.cases)
   let b = this.analyze(s.body)
   let d = this.anaylze(s.defaultCase) 
    s.expression = e !== undefined ? e : s.body
    s.cases = c !== undefined ? c : s.cases
    s.body = b !== undefined ? b : s.body
    s.defaultCases = d !== undefined ? d : s.defaultCases
    
   */    
  }
  NewInstance(n) {
    // new identifier "(" Arguments ? ")"
  // constructor(identifier, args) {s
    let i = this.analyze(n.identifier)
    let a = this.analyze(n.args)
    n.identifier = i !== undefined ? i : n.identifier
    n.args = a !== undefined ? a : n.args
    
    let x = this.lookup(n.identifier)
    let c = undefined
    for (let s of x.body) {
      if (s.parameters !== undefined) {
        c = s
        break
      }
    }

    if (c !== undefined) {
      if (n.args.length > c.parameters.parameter.length) {
        throw new Error(`Excuse me old spirit, you have too many arguments to instantiate ${x.name}.`)
      }
      if (n.args.length < c.parameters.parameter.length) {
        throw new Error(`Excuse me old spirit, you have too few arguments to instantiate ${x.name}.`)
      }
      for (let i = 0; i < c.args.length; i++) {
        if (c.args[i].arg.type.name !== c.parameters.parameter[i].type) {
          throw new Error(`Excuse me old spirit, the type of your argument '${c.args[i].arg.value}' does not match the required type '${c.parameters.parameter[i].type}' .`)
        }
      }
    } else {
      throw new Error(`Excuse me forgetful spirit. Your instance has no constructor! How embarrassing!`)
    }

    console.log(x)


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
  Dictionary(d) { }
  DictionaryEntry(d) { }
  DictionaryEntries(d) { }
  Parameter(p) {
    this.add(p.name, p)
    return p
  }
  Parameters(p) {
    p.parameter = this.analyze(p.parameter)
    return p
  }
  Arguments(a) {
    let x
    for (let n of a.names) {
      x = this.analyze(n)
      n = x !== undefined? x : n
    }
    console.log(a)
  }
  Argument(a) {
    let x = this.analyze(a.arg)
    x = (x === undefined)? a.arg: x
    //console.log(a)
    if (a.arg.name !== undefined) {
      this.lookup(a.arg.name)
    }
    console.log(a)
    return a
  }
  Incrementer(i) {
    let x = this.lookup(i.operand.name)
    //console.log("x", x)
    check(x).isNumeric()
    return i
  }
  BreakStatement(s) {
    return s
  }

  Switch(s) {
    return s
  }
  PlainAssignment(a) {
    a.expression = this.analyze(a.expression)
    let x = this.lookup(a.variable.name)
    check(this).isMeltable(x.mutability)
    check(x).hasSameTypeAs(a.expression)
    return a
  }
  IncrementalAssignment(i) {
    let v = this.analyze(i.variable)
    i.variable = v !== undefined ? v : i.variable
    let o = this.analyze(i.operand)
    i.operand = o !== undefined ? o : i.operand
    return i
  }
  BinaryExpression(e) {
    let left = this.analyze(e.left)
    let right = this.analyze(e.right)
    // if given an identifier get it's type
    if (left.name !== undefined) {
      let x = this.lookup(left.name)
      left.type = x.type
    }
    if (right.name !== undefined) {
      let y = this.lookup(right.name)
      right.type = y.type
    }

    e.left = (left === undefined) ? e.left: left
    e.right = (right === undefined) ? e.right : right
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
    } if (["-", "*", "/", "%", "**", "<", "<=", ">", ">="].includes(e.op)) {
      check(e.left).isNumeric()
      check(e.right).isNumeric()
      if (e.left.type.name === e.right.type.name) {
        e.type = e.left.type
      } else {
        e.type = Type.ELSA
      }
    }
    return e
  }
  UnaryExpression(e) {
    //console.log(e)
    e.right = this.analyze(e.right)
    if (e.op === "-") {
      check(e.right).isNumeric()
      e.type = e.right.type
    } else if (e.op === "!") {
      check(e.right).isBoolean()
      e.type = Type.LOVE
    } 
    //console.log(e)
    return e
  }
  Identifier(i) {
    return i
   }
   Case() {}
   DefaultCase() {}
  GetProperty(p) {
    //console.log("Source: ",p.source)
    let x = this.lookup(p.source.name)
    // console.log(x)
    x = x.expression
    for (let property of p.property) {
      //console.log(util.inspect(x, {depth: 100}))
      check(property).isAccessible(x)
      x = (x.expression === undefined) ? x.values: x.expression
    }
    this.type = Type.ANY
    return p
  }
  Call(c) {
    let name = this.analyze(c.name)
    let args = this.analyze(c.args)
    c.name = name !== undefined? name : c.name
    c.args = args !== undefined? args : c.args
    if (c.name.name !== "Sing" && c.name.name !== undefined) {
      let call = this.lookup(c.name.name)
      if (c.args.length > call.parameters.parameter.length) {
        throw new Error(`Excuse me old spirit, you have too many arguments to call ${call.name}.`)
      }
      if (c.args.length < call.parameters.parameter.length) {
        throw new Error(`Excuse me old spirit, you have too few arguments to call ${call.name}.`)
      }
      for (let i = 0; i < c.args.length; i++) {
        if (c.args[i].arg.type.name !== call.parameters.parameter[i].type) {
          throw new Error(`Excuse me old spirit, the type of your argument '${c.args[i].arg.value}' does not match the required type '${call.parameters.parameter[i].type}'.`)
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