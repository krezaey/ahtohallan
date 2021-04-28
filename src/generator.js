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
      gen(p.instructions)
    },
    Variable(d) {
      if (d.mutabiltiy === 'Meltable') {
        output.push(`let ${gen(d.variable)} = ${gen(d.expression)};`)
      }
      else {
        output.push(`const ${gen(d.variable)} = ${gen(d.expression)};`)
      }
    },
    ReturnStatement(r) { 
      output.push(`return ${gen(r.expression)};`)
    },
    ShortReturnStatement(r) {
      output.push(`return;`)
    },
    Function(f) {
      //need to add
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
      //need to adjust
      const i = targetName(s.iterator)
      const op = s.op === "..." ? "<=" : "<"
      output.push(`for (let ${i} = ${gen(s.low)}; ${i} ${op} ${gen(s.high)}; ${i}++) {`)
      gen(s.body)
      output.push("}")
    },
    SwitchStatement(s) {

    },
    BreakStatement(s) {
      output.push("break;")
    },
    NewInstance(n) {

    },
    // Array(a) {
    //   return a.map(gen)
    // },
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
      if (s.op === "++") {
        output.push(`${gen(s.operand)}++;`)
      }
      if (s.op === "--") {
        output.push(`${gen(s.operand)}--;`)
      }
    },
    PlainAssignment(s) {
      output.push(`${gen(s.variable)} = ${gen(s.expression)};`)
    },
    IncrementalAssignment(s) {
      if (s.operand === "+=") {
        output.push(`${gen(s.variable)}+= ${gen(s.operand)};`)
      }
      if (s.op === "-=") {
        output.push(`${gen(s.variable)}-= ${gen(s.operand)};`)
      }
    },
    BinaryExpression(e) {
      const op = { "==": "===", "!=": "!==" }[e.op] ?? e.op
      return `(${gen(e.left)} ${op} ${gen(e.right)})`
    },
    UnaryExpression(e) {
        return `${e.op}(${gen(e.right)})`
    },
    Identifier(i) {
      return
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
    Booley(e) {
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
    // String(e) {
    //   // This ensures in JavaScript they get quotes!
    //   return e
    // }, 
  }

  gen(program)
  return output.join("\n")
}