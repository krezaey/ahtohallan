// Optimizer
//
// This module exports a single function to perform machine-independent
// optimizations on the analyzed semantic graph.
//
// The only optimizations supported here are:
//
//   - assignments to self (x = x) turn into no-ops
//   - constant folding
//   - some strength reductions (+0, -0, *0, *1, etc.)
//   - turn references to built-ins true and false to be literals
//   - remove all disjuncts in || list after literal true
//   - remove all conjuncts in && list after literal false
//   - while-false becomes a no-op
//   - repeat-0 is a no-op
//   - for-loop over empty array is a no-op
//   - for-loop with low > high is a no-op
//   - if-true and if-false reduce to only the taken arm
// 
// What the Ahtohallan team added
//   - Prune off any if/ else if false conditional groups so that they just don't exist
//   - In the case of &&, if one of the values is false, return false
//   - In the case of || if one of the values if true, return true


import * as ast from "./ast.js"

export default function optimize(node) {
  return optimizers[node.constructor.name](node)
}

const optimizers = {
  Program(p) {
    p.instructions = optimize(p.instructions)
    return p
  },
  Variable(d) {
    if (d.expression !== null) {
      d.expression = optimize(d.expression)
    } else if (d.name !== null && d.expression === null) {
      d.expression = optimize(d.name)
    }
    return d
  },
  ReturnStatement(r) {
    r.expression = optimize(r.expression)
    return r
  },
  ShortReturnStatement(r) {
    return r
  },
  Function(d) {
    d.parameters = optimize(d.parameters)
    d.body = optimize(d.body)
    return d
  },
  Snow(c) {
    c.body = optimize(c.body)
    return c
  },
  Constructor(c) {
    c.parameters = optimize(c.parameters)
    c.body = optimize(c.body)
    return c
  },
  Method(m) {
    m.parameters = optimize(m.parameters)
    m.body = optimize(m.body)
    return m
  },
  Field(f) {
    f.field = optimize(f.field)
    return f
  },
  IfStatement(s) {
    s.condition = optimize(s.condition)
    console.log(s.condition)

    let removals = []
    let body = []
    let condition = []
    for (let i = 0; i < s.condition.length; i++) {
      console.log(s.condition[i].value, "at index", i)
      if (s.condition[i].value === "Hans") {
        // prune it out
        removals.push(i)
      } else if (s.condition[i].value === "Kristoff") {
        if (i === 0) { return optimize(s.body[i]) }
      }
    }
    for (let i = 0; i < s.condition.length; i++) {
      if (!removals.includes(i)) {
        condition.push(s.condition[i])
        body.push(s.body[i])
      }
    }
    s.condition = condition
    s.body = optimize(body)
    console.log(body)
    if (s.body.length === 0) {
      return optimize(s.alternate)
    }
    s.alternate = optimize(s.alternate)
    return s
  },
  WhileLoop(w) {
    w.expression = optimize(w.expression)
    if (w.expression.value === "Hans") {
      // If false don't bother parsing
      return []
    }
    w.body = optimize(w.body)
    return w
  },

  Access(a) {
    a.accessValue = optimize(a.accessValue)
    a.accessMethod = optimize(a.accessMethod)
    return a
  },
  ForLoop(f) {
    f.start = optimize(f.start)
    f.limit = optimize(f.limit)
    f.increment = optimize(f.increment)
    f.body = optimize(f.body)
    return f
  },
  SwitchStatement(s) {
    s.expression = optimize(s.expression)
    s.cases = optimize(s.cases)
    s.body = optimize(s.body)
    s.defaultCase = optimize(s.defaultCase)
    return s
  },
  BreakStatement(b) {
    return b
  },
  NewInstance(i) {
    i.identifier = optimize(i.identifier)
    i.args = optimize(i.args)
    return i
  },
  Array(a) {
    return a.flatMap(optimize)
  },
  ArrayExpression(a) {
    a.values = optimize(a.values)
    return a
  },
  Dictionary(d) {
    d.entries = optimize(d.entries)
    return d
  },
  DictionaryEntry(d) {
    d.value = optimize(d.value)
    d.key = optimize(d.key)
    return d
  },
  DictionaryEntries(d) {
    d.entries = optimize(d.entries)
    return d
  },
  Parameter(p) {
    p.type = optimize(p.type)
    return p
  },
  Parameters(p) {
    p.parameter = optimize(p.parameter)
    return p
  },
  Arguments(a) {
    a.names = optimize(a.names)
    return a
  },
  Argument(a) {
    a.arg = optimize(a.arg)
    return a
  },
  Incrementer(i) {
    i.operand = optimize(i.operand)
    return i
  },
  PlainAssignment(a) {
    a.variable = optimize(a.variable)
    a.expression = optimize(a.expression)
    if (a.expression.expression === a.variable.name) {
      return []
    }
    return a
  },
  IncrementalAssignment(a) {
    a.operand = optimize(a.operand)
    a.variable = optimize(a.variable)
    return a
  },
  BinaryExpression(e) {
    e.left = optimize(e.left)
    e.right = optimize(e.right)
    if (e.op === "&&") {
      if (e.left.value === "Hans") return new ast.Booley("Hans")
      else if (e.right.value === "Hans") return new ast.Booley("Hans")
      else if (e.left.value === "Kristoff") return e.right
      else if (e.right.value === "Kristoff") return e.left
    } else if (e.op === "||") {
      if (e.left.value === "Kristoff") return new ast.Booley("Kristoff")
      else if (e.right.value === "Kristoff") return new ast.Booley("Kristoff")
      else if (e.left.value === "Hans") return e.right
      else if (e.right.value === "Hans") return e.left
    } else if (["Float", "Integer"].includes(e.left.constructor.name)) {
      if (e.left.value === 0 && ["*", "/"].includes(e.op)) return new ast.Float(0)
      else if (e.left.value === 0 && e.op === "+") return e.right
      else if (e.left.value === 1 && e.op === "*") return e.right
      else if (e.left.value === 0 && e.op === "-") return optimize(new ast.UnaryExpression("-", e.right))
      else if (e.left.value === 1 && e.op === "**") return new ast.Float(1)
      else if (e.op === "+") return new ast.Float(e.left.value + e.right.value)
      else if (e.op === "-") return new ast.Float(e.left.value - e.right.value)
      else if (e.op === "*") return new ast.Float(e.left.value * e.right.value)
      else if (e.op === "/") return new ast.Float(e.left.value / e.right.value)
      else if (e.op === "**") return new ast.Float(e.left.value ** e.right.value)
      else if (e.op === "<") return new ast.Booley((e.left.value < e.right.value) ? "Kristoff" : "Hans")
      else if (e.op === "<=") return new ast.Booley(e.left.value <= e.right.value ? "Kristoff" : "Hans")
      else if (e.op === "==") return new ast.Booley(e.left.value === e.right.value ? "Kristoff" : "Hans")
      else if (e.op === "!=") return new ast.Booley(e.left.value !== e.right.value ? "Kristoff" : "Hans")
      else if (e.op === ">=") return new ast.Booley(e.left.value >= e.right.value ? "Kristoff" : "Hans")
      else if (e.op === ">") return new ast.Booley(e.left.value > e.right.value ? "Kristoff" : "Hans")
    } else if (["Float", "Integer"].includes(e.right.constructor.name)) {
      // Numeric constant folding when right operand is constant
      if (["+", "-"].includes(e.op) && e.right.value === 0) return e.left
      else if (["*", "/"].includes(e.op) && e.right.value === 1) return e.left
      else if (e.op === "*" && e.right.value === 0) return new ast.Float(0)
      else if (e.op === "**" && e.right.value === 0) return new ast.Float(1)
    }
    return e
  },
  UnaryExpression(e) {
    e.right = optimize(e.right)
    if (["Integer", "Float"].includes(e.right.constructor.name)) {
      if (e.op === "-") return new ast.Float(-1 * e.right.value)
    }
    return e
  },
  GetProperty(p) {
    p.property = optimize(p.property)
    return p
  },

  Type(t) {
    return t
  },
  Call(c) {
    c.args = optimize(c.args)
    c.name = optimize(c.name)
    return c
  },
  String(s) {
    return s
  },
  Booley(b) {
    return b
  },
  Integer(n) {
    return n
  },
  Float(n) {
    return n
  },
  Phrase(n) {
    return n
  }
}