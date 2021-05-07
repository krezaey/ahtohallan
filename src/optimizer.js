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
    // Flatmap since each element can be an array
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
    p.name = optimize(p.name)
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
    ["-", "*", "/", "%", "**", "<", "<=", ">", ">=", "==", "+"]

    // To Do

    return e
  },  
  UnaryExpression(e) {
    e.right = optimize(e.right)
    if (e.right.constructor.name === "Float" ||e.right.constructor.name === "Integer") {
      if (e.op === "-") {
        return -e.right
      }
    }
    return e
  },
  Identifier(i) {
    return i
  },
  GetProperty(p) {
    p.source = optimize(p.source)
    p.property = optimize(p.property)
    return p
  },
  Call(c) {
    c.args = optimize(c.args)
    return c
  },
  String(s) {
    return(s)
  },
  // Type(t) {
  //   t.name = optimize(t.name)
  //   return t
  // },
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
    

  //CARLOS
  
  Assignment(s) {
    s.source = optimize(s.source)
    s.target = optimize(s.target)
    if (s.source === s.target) {
      return []
    }
    return s
  },
  BreakStatement(s) {
    return s
  },
  ReturnStatement(s) {
    s.expression = optimize(s.expression)
    return s
  },
  ShortReturnStatement(s) {
    return s
  },
  IfStatement(s) {
    s.test = optimize(s.test)
    s.consequent = optimize(s.consequent)
    s.alternate = optimize(s.alternate)
    if (s.test.constructor === Boolean) {
      return s.test ? s.consequent : s.alternate
    }
    return s
  },
  ShortIfStatement(s) {
    s.test = optimize(s.test)
    s.consequent = optimize(s.consequent)
    if (s.test.constructor === Boolean) {
      return s.test ? s.consequent : []
    }
    return s
  },
  WhileStatement(s) {
    s.test = optimize(s.test)
    if (s.test === false) {
      // while false is a no-op 
      return []
    }
    s.body = optimize(s.body)
    return s
  },
  RepeatStatement(s) {
    s.count = optimize(s.count)
    if (s.count === 0) {
      // repeat 0 times is a no-op
      return []
    }
    s.body = optimize(s.body)
  },
  ForLoop(s) {
    s.start = optimize(s.start)
    s.limit = optimize(s.limit)
    s.increment = optimize(s.increment)
    s.body = optimize(s.body)
    if (s.low.constructor === Number) {
      if (s.high.constructor === Number) {
        if (s.low > s.high) {
          return []
        }
      }
    }
    return s
  },
  // ForStatement(s) {
  //   s.collection = optimize(s.collection)
  //   s.body = optimize(s.body)
  //   if (s.collection.constructor === ast.EmptyArray) {
  //     return []
  //   }
  //   return s
  // },
  Conditional(e) {
    e.test = optimize(e.test)
    e.consequent = optimize(e.consequent)
    e.alternate = optimize(e.alternate)
    if (e.test.constructor === Boolean) {
      return e.test ? e.consequent : e.alternate
    }
    return e
  },
  BinaryExpression(e) {
    e.left = optimize(e.left)
    e.right = optimize(e.right)
    if (e.op === "??") {
      // Coalesce Empty Optional Unwraps
      if (e.left.constructor === ast.EmptyOptional) {
        return e.right
      }
    } else if (e.op === "&&") {
      // Optimize boolean constants in && and ||
      if (e.left === true) return e.right
      else if (e.right === true) return e.left
    } else if (e.op === "||") {
      if (e.left === false) return e.right
      else if (e.right === false) return e.left
    } else if ([Number, BigInt].includes(e.left.constructor)) {
      // Numeric constant folding when left operand is constant
      if ([Number, BigInt].includes(e.right.constructor)) {
        if (e.op === "+") return e.left + e.right
        else if (e.op === "-") return e.left - e.right
        else if (e.op === "*") return e.left * e.right
        else if (e.op === "/") return e.left / e.right
        else if (e.op === "**") return e.left ** e.right
        else if (e.op === "<") return e.left < e.right
        else if (e.op === "<=") return e.left <= e.right
        else if (e.op === "==") return e.left === e.right
        else if (e.op === "!=") return e.left !== e.right
        else if (e.op === ">=") return e.left >= e.right
        else if (e.op === ">") return e.left > e.right
      } else if (e.left === 0 && e.op === "+") return e.right
      else if (e.left === 1 && e.op === "*") return e.right
      else if (e.left === 0 && e.op === "-") return new ast.UnaryExpression("-", e.right)
      else if (e.left === 1 && e.op === "**") return 1
      else if (e.left === 0 && ["*", "/"].includes(e.op)) return 0
    } else if (e.right.constructor === Number) {
      // Numeric constant folding when right operand is constant
      if (["+", "-"].includes(e.op) && e.right === 0) return e.left
      else if (["*", "/"].includes(e.op) && e.right === 1) return e.left
      else if (e.op === "*" && e.right === 0) return 0
      else if (e.op === "**" && e.right === 0) return 1
    }
    return e
  },
  UnaryExpression(e) {
    e.operand = optimize(e.operand)
    if (e.operand.constructor === Number) {
      if (e.op === "-") {
        return -e.operand
      }
    }
    return e
  },
  // EmptyOptional(e) {
  //   return e
  // },
  // SubscriptExpression(e) {
  //   e.array = optimize(e.array)
  //   e.index = optimize(e.index)
  //   return e
  // },
  ArrayExpression(e) {
    e.elements = optimize(e.elements)
    return e
  },
//   Dictionary(d) {
//     return d
//   },
//   DictionaryEntry(d) {
//     return d
//   },
//   DictionaryEntries(d) {
//     return d
//   },
  // EmptyArray(e) {
  //   return e
  // },
  // MemberExpression(e) {
  //   e.object = optimize(e.object)
  //   return e
  // },
  Call(c) {
    c.callee = optimize(c.callee)
    c.args = optimize(c.args)
    return c
  },
  Integer(e) {
    return e
  },
  Number(e) {
    return e
  },
  Boolean(e) {
    return e
  },
  String(e) {
    return e
  },
  Array(a) {
    // Flatmap since each element can be an array
    return a.flatMap(optimize)
  },
}