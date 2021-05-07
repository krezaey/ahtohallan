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

import * as ast from "./ast.js"

export default function optimize(node) {
  console.log("Optimizing ", node.constructor.name)
  console.log("Hello", optimizers[node.constructor.name](node))
  return optimizers[node.constructor.name](node)
}

const optimizers = {
  Program(p) {
    p.instructions = optimize(p.instructions)
    return p
  },
  Variable(d) {
    d.expression = optimize(d.expression)
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
    d.body = optimize(d.body)
    return d
  },
  Snow(c) {
    c.body = optimize(c.body)
    return c
  },
  Constructor(c) {
    c.body = optimize(c.body)
    return c
  }, 
  Method(m) {
    m.body = optimize(m.body)
    return m
  },
  Field(f) {
    f.field = optimize(f.field)
    return f
  },
  IfStatement(s) {
    s.condition = optimize(s.condition)
    for (let i = 0; i < s.condition.length; i++) {
      if (s.condition[i] === false){
        // prune it out
        s.body.splice(i)
        s.condition.splice(i)
      }
    }
    s.body = optimize(s.body)
    s.alternate = optimize(s.alternate)
    return s
  },
  WhileLoop(w) {
    w.expression = optimize(w.expression)
    if (w.expression === false) {
      // If false don't bother parsing
      return
    }
    w.body = optimize(x.body)
    return w
  },

  //export class Access {
//   constructor(accessValue, accessMethod) {
//     Object.assign(this, { accessMethod, accessValue })
//   }
// }
  Access(a) {
    a.accessValue = optimize(a.accessValue)
    a.accessMethod= optimize(a.accessMethod)
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
    // ["-", "*", "/", "%", "**", "<", "<=", ">", ">=", "==", "+"]
    if ((e.left.name !== undefined) && (e.right.name !== undefined)) {
      if (e.op == "&&") {
        if (e.left === false) return false
        else if (e.right === false) return false
        else return true
      } else if (e.op == "||") {
        if (e.left == true) return true
        else if (e.right == true) return true
        else return false
      } else if ([ast.Type.Anna, ast.Type.Elsa].includes(e.type)) {
        if (e.op == "+") return e.left + e.right
        else if (e.op == "-") return e.left - e.right
        else if (e.op == "*") return e.left * e.right
        else if (e.op == "/") return e.left / e.right
        else if (e.op == "**") return e.left ** e.right
        else if (e.op == "<") return e.left < e.right
        else if (e.op == "<=") return e.left <= e.right
        else if (e.op == "==") return e.left == e.right
        else if (e.op == "!=") return e.left != e.right
        else if (e.op == ">=") return e.left >= e.right
        else if (e.op == ">") return e.left > e.right
        else if (e.left === 0 && e.op === "+") return e.right
        else if (e.left === 1 && e.op === "*") return e.right
        else if (e.right === 1 && e.op === "*") return e.left
        else if (e.left === 0 && e.op === "-") return new ast.UnaryExpression("-", e.right)
        else if (e.left === 1 && e.op === "**") return 1
        else if (e.left === 0 && ["*", "/"].includes(e.op) && e.right === 1) return 0
        // Numeric constant folding when right operand is constant
        if (["+", "-"].includes(e.op && e.right == 0)) return e.left
        else if (["*", "/"].includes(e.op) && e.right == 1) return e.left
        else if (e.op === "*" && e.right === 0) return 0
        else if (e.op === "**" && e.right === 0 ) return 1
      }
    }
    return e
  },  
  UnaryExpression(e) {
    e.right = optimize(e.right)
    if (e.right.constructor.name === "Float" || e.right.constructor.name === "Integer") {
      if (e.op === "-") return -e.right
    } else if (e.right.constructor.name === "Booley") return !e.right
    return e
  },
  Identifier(i) {
    return i
  },
  GetProperty(p) {
    p.property = optimize(p.property)
    return p
  },
  Call(c) {
    c.args = optimize(c.args)
    return c
  },
  String(s) {
    return s
  },
  Integer(i) {
    return i
  },
  Float(f) {
    return f
  },
  Phrase(p) {
    return p
  },
  Booley(b) {
    return b
  },
}