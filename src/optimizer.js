// import * as ast from "./ast.js"

export default function optimize(node) {
  return optimizers[node.constructor.name](node)
}

// Taken from Carlos Lang 
// const optimizers = {
//     Program(p) {
//       p.statements = optimize(p.statements)
//       return p
//     },
//     VariableDeclaration(d) {
//       d.initializer = optimize(d.initializer)
//       return d
//     },
//     TypeDeclaration(d) {
//       return d
//     },
//     StructType(d) {
//       return d
//     },
//     FunctionDeclaration(d) {
//       console.log(d)
//       console.log(d.fun)
//       d.body = optimize(d.body)
//       return d
//     },
//     Variable(v) {
//       return v
    // }