
// import { IfStatement } from "./ast.js"
// import * as stdlib from "./stdlib.js"

// // Carlos Lang 
// ForStatement(s) {
//     output.push(`for (let ${gen(s.iterator)} of ${gen(s.collection)}) {`)
//     gen(s.body)
//     output.push("}")
//   },
//   Conditional(e) {
//     return `((${gen(e.test)}) ? (${gen(e.consequent)}) : (${gen(e.alternate)}))`
//   },
//   BinaryExpression(e) {
//     const op = { "==": "===", "!=": "!==" }[e.op] ?? e.op
//     return `(${gen(e.left)} ${op} ${gen(e.right)})`
//   },
//   UnaryExpression(e) {
//     return `${e.op}(${gen(e.operand)})`
//   },
//   EmptyOptional(e) {
//     return "undefined"
//   },
//   SubscriptExpression(e) {
//     return `${gen(e.array)}[${gen(e.index)}]`
//   },
//   ArrayExpression(e) {
//     return `[${gen(e.elements).join(",")}]`
//   },
//   EmptyArray(e) {
//     return "[]"
//   },
//   MemberExpression(e) {
//     return `(${gen(e.object)}[${JSON.stringify(gen(e.field))}])`
//   },
//   Call(c) {
//     const targetCode = standardFunctions.has(c.callee)
//       ? standardFunctions.get(c.callee)(gen(c.args))
//       : c.callee.constructor === StructType
//       ? `new ${gen(c.callee)}(${gen(c.args).join(", ")})`
//       : `${gen(c.callee)}(${gen(c.args).join(", ")})`
//     // Calls in expressions vs in statements are handled differently
//     if (c.callee instanceof Type || c.callee.type.returnType !== Type.VOID) {
//       return targetCode
//     }
//     output.push(`${targetCode};`)
//   },
//   Number(e) {
//     return e
//   },
//   BigInt(e) {
//     return e
//   },
//   Boolean(e) {
//     return e
//   },
//   String(e) {
//     // This ensures in JavaScript they get quotes!
//     return JSON.stringify(e)
//   },
//   Array(a) {
//     return a.map(gen)
//   },
// }
