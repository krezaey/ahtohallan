import { IfStatement, Type, SwitchStatement } from "./ast.js"
import * as stdlib from "./stdlib.js"

export default function generate(program) {
  const output = []

  const standardFunctions = new Map([
    [stdlib.functions.Sing.name, x => `console.log(${x})`],
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

  // const getValue = node => {
  //   if (node.name !== undefined) {
  //     return node.name
  //   }
  // }

  const gen = node => {
    console.log(`About to analyze a ${node.constructor.name}`)
    // console.log(node)
    return generators[node.constructor.name](node)
  }

  const generators = {
    // Key idea: when generating an expression, just return the JS string; when
    // generating a statement, write lines of translated JS to the output array.
    Program(p) {
      gen(p.instructions)
    },
    Variable(d) {
      if (d.mutability === 'Meltable') {
        if (d._return === true) {
          return `let ${gen(d.name)} = ${gen(d.expression)};`
        }
        output.push(`let ${gen(d.name)} = ${gen(d.expression)};`)
      }
      else {
        if (d._return === true) {
          return `const ${gen(d.name)} = ${gen(d.expression)};`
        }
        output.push(`const ${gen(d.name)} = ${gen(d.expression)};`)
      }
    },
    ReturnStatement(r) {
      output.push(`return ${gen(r.expression)};`)
    },
    ShortReturnStatement(r) {
      output.push(`return;`)
    },
    Function(f) {
      output.push(`function ${gen(f.name)}(${gen(f.parameters).join(", ")}) {`)
      gen(f.body)
      output.push(`}`)
    },
    Snow(c) {
      output.push(`class ${gen(f.name)} {`)
      gen(c.body)
      output.push(`}`)
    },
    Constructor(c) {
      output.push(`constructor ${gen(c.parameters).join(", ")} {`)
      gen(c.body)
      output.push(`}`)
    },
    Method(m) {
      output.push(`function ${gen(m.name)} (${gen(m.parameters).join(", ")}) {`)
      gen(m.body)
      output.push(`}`)
    },
    Field(f) {
      return targetName(f)
    },
    IfStatement(s) {
      output.push(`if (${gen(s.condition[0])}) {`)
      gen(s.body[0])
      for (let i = 1; i < s.condition.length; i++) {
        output.push(`} else if (${gen(s.condition[i])}) {`)
        gen(s.body[i])
      }
      output.push("} else {")
      gen(s.alternate)
      output.push("}")
    },
    WhileLoop(s) {
      output.push(`while (${gen(s.expression)}) {`)
      gen(s.body)
      output.push("}")
    },
    Access(a) {
      let method
      let property = ""
      switch (a.accessMethod) {
        case "[[]]":
          method = "[]"
          break
        case ".":
          method = "."
          break
        case "[]":
          method = "[]"
          break
      }
      property += method === "." ? "." : "["
      property += `${accessValue}`
      property += method === "." ? "" : "]"
      return property
    },
    ForLoop(s) {
      s.start._return = true
      s.increment._return = true
      output.push(`for (${gen(s.start)} ${gen(s.limit)}; ${gen(s.increment)}) {`)
      gen(s.body)
      output.push("}")
    },
    SwitchStatement(s) { // this is incomplete, please work on later
      output.push(`switch (${gen(s.expression)}) {`)
      for (let i = 0; i < s.cases.length, i < s.body.length; i++) {
        output.push(`case ${gen(s.cases[i])}:`)
        gen(s.body[i])
      }
      output.push(`default:`)
      gen(s.defaultCase)
      output.push("}")
      // expression, cases, body, defaultCase)
      // switch (s.condition) {
      // if (s.alternate.constructor === SwitchStatement) {
      //   output.push(`} case1 (${gen(s.condition)}) {`)
      //   gen(s.body)
      //   output.push("}")
      // } else {
      //   output.push(`} case2 (${gen(s.condition)}) {`)
      //   gen(s.body)
      //   output.push("}")
      // }
    },
    BreakStatement(s) {
      output.push("break;")
    },
    NewInstance(n) {
      output.push(`new ${gen(n.identifier)}(${gen(n.args).join(", ")})`)

    },
    Array(a) {
      return a.map(gen)
    },
    ArrayExpression(e) {
      return `[${gen(e.elements).join(",")}]`
    },
    Dictionary(d) {
      return `{${gen(d.entries).join(", ")}}`
    },
    DictionaryEntry(d) {
      return `${gen(d.key)}:${gen(d.value)}`
    },
    DictionaryEntries(d) {
      return `${gen(d.entries).join(", ")}`
    },
    Parameters(p) {
      let params = []
      p.parameter.forEach(param => {
        params.push(`${param.name}`)
      });
      return params
    },
    Arguments(a) {
      let args = ``
      for (let arg of a.names) {
        args += `${gen(arg)},`
      }
      if (a.names.length > 0) {
        args = args.slice(0, this.args.length - 2)
      }
      // output.push(arguments)
      return args
    },
    Argument(a) {
      return gen(a.arg)
    },
    Incrementer(s) {
      if (s.op === "++") {
        if (s._return === true) {
          return `${gen(s.operand)}++`
        }
        output.push(`${gen(s.operand)}++;`)
      }
      if (s.op === "--") {
        if (s._return === true) {
          return `${gen(s.operand)}--`
        }
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
      return `${gen(i.name)}`
    },
    GetProperty(p) {
      let property = `${p.source}`
      for (let prop of p.property) {
        property += gen(prop)
      }
      output.push(property)
    },
    Call(c) {
      const targetCode = standardFunctions.has(c.name)
        ? standardFunctions.get(c.name)(gen(c.args))
        : `${gen(c.name)}(${gen(c.args).join(", ")})`
      // // Calls in expressions vs in statements are handled differently
      // if (c.name instanceof Type || c.name.type.returnType !== Type.SAMANTHA) {
      //   return targetCode
      // }
      output.push(`${targetCode};`)
    },
    String(s) {
      let name = s.includes("~") ? (s.replace(/[~]+/g, '')) : s
      return name
    },
    Booley(e) {
      return e.value === 'Hans'? false : true
    },
    Integer(e) {
      return e.value
    },
    Float(e) {
      return e.value
    },
    Phrase(e) {
      // This ensures in JavaScript they get quotes!
      return JSON.stringify(e.value)
    },
    // String(e) {
    //   // This ensures in JavaScript they get quotes!
    //   return e
    // }, 
  }

  gen(program)
  return output.join("\n")
}