import { IfStatement, Type, StructType } from "./ast.js"
import * as stdlib from "./stdlib.js"

export default function generate(program) {
  const output = []

  const standardFunctions = new Map([
    [stdlib.functions.Sing, x => `console.log(${x})`],
  ])

  // Variable and function names in JS will be suffixed with _1, _2, _3,
  // etc. This is because "switch", for example, is a legal name in Carlos,
  // but not in JS. So, the Carlos variable "switch" must become something
  // like "switch_1". We handle this by mapping each name to its suffix.
  const targetName = (mapping => {
    return entity => {
      if (!mapping.has(entity)) {
        mapping.set(entity, mapping.size + 1)
      }
      return `${entity.name ?? entity.description}_${mapping.get(entity)}`
    }
  })(new Map())

  const gen = node => generators[node.constructor.name](node)

  const generators = {
    // Key idea: when generating an expression, just return the JS string; when
    // generating a statement, write lines of translated JS to the output array.
    Program(p) {
      gen(p.statements)
    },
    Variable(d) {
      if (d.mutabiltiy === 'Meltable') {
        output.push(`let ${gen(d.variable)} = ${gen(d.initializer)};`)
      }
      else {
        output.push(`const ${gen(d.variable)} = ${gen(d.initializer)};`)
      }
    },
    ReturnStatement(r) { 
    
    },
    ShortReturnStatement(r) {

    },
    Function(f) {
      return targetName(f)
    },
    Snow(c) {
      
    },
    Constructor(c) {

    },
    Method(m) {

    },
    Field(f) {
        return targetName(f)
    },
    IfStatement(s) {
      output.push(`if (${gen(s.test)}) {`)
      gen(s.consequent)
      if (s.alternate.constructor === IfStatement) {
        output.push("} else")
        gen(s.alternate)
      } else {
        output.push("} else {")
        gen(s.alternate)
        output.push("}")
      }
    },
    WhileLoop(s) {
      output.push(`while (${gen(s.test)}) {`)
      gen(s.body)
      output.push("}")
    },
    Access(a) {
      //array
      return `${gen(e.array)}[${gen(e.index)}]`
    },
    ForLoop(s) {
      const i = targetName(s.iterator)
      const op = s.op === "..." ? "<=" : "<"
      output.push(`for (let ${i} = ${gen(s.low)}; ${i} ${op} ${gen(s.high)}; ${i}++) {`)
      gen(s.body)
      output.push("}")
    },
    SwitchStatement(s) {

    },
    NewInstance(n) {

    },
    Array(a) {
      return a.map(gen)
    },
    ArrayExpression(e) {
        return `[${gen(e.elements).join(",")}]`
    },
    Dictionary() {

    }, 
    DictionaryEntry() {

    },
    DictionaryEntries() {

    }, 
    Parameter(p) {
      return targetName(p)
    }, 
    Parameters(p) {
      
    },
    Arguments(a) {

    }, 
    Argument(a) {
        
    },
    Increment(s) {
      output.push(`${gen(s.variable)}++;`)
      output.push(`${gen(s.variable)}--;`)
    },
    BreakStatement(s) {
        output.push("break;")
    },
    PlainAssignment(s) {
      output.push(`${gen(s.target)} = ${gen(s.source)};`)
    },
    IncrementalAssignment(s) {
      output.push(`${gen(s.variable)}+=;`)
      output.push(`${gen(s.variable)}-=;`)
    },
    BinaryExpression(e) {
      const op = { "==": "===", "!=": "!==" }[e.op] ?? e.op
      return `(${gen(e.left)} ${op} ${gen(e.right)})`
    },
    UnaryExpression(e) {
        return `${e.op}(${gen(e.operand)})`
    },
    Identifier(i) {

    }, 
    GetProperty() {

    }, 
    Call(c) {
      const targetCode = standardFunctions.has(c.callee)
      ? standardFunctions.get(c.callee)(gen(c.args))
      : c.callee.constructor === StructType
      ? `new ${gen(c.callee)}(${gen(c.args).join(", ")})`
      : `${gen(c.callee)}(${gen(c.args).join(", ")})`
      // Calls in expressions vs in statements are handled differently
      if (c.callee instanceof Type || c.callee.type.returnType !== Type.VOID) {
        return targetCode
      }
      output.push(`${targetCode};`)
    },
    String(e) {
      // This ensures in JavaScript they get quotes!
      return e
    },
    Integer(e) {
      return e
    },
    Float(e) {
      return e
    },
    Phrase(e) {
      // This ensures in JavaScript they get quotes!
      return JSON.stringify(e)
    },
    Booley(e) {
      return e
    },
  }

  gen(program)
  return output.join("\n")
}