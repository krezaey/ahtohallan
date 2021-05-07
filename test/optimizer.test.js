import assert from "assert"
import optimize from "../src/optimizer.js"
import * as ast from "../src/ast.js"
import { type } from "os"

const x = new ast.Variable("Meltable", "Anna", "x", null)
const z = new ast.Variable("Meltable", "Anna", "z", null)
const xinc = new ast.Incrementer(x, "++")
const xdec = new ast.Incrementer(x, "--")
const return1p1 = new ast.ReturnStatement(new ast.BinaryExpression(1, "+", 1))
const return2 = new ast.ReturnStatement(2)
const returnX = new ast.ReturnStatement(x)
const onePlusTwo = new ast.BinaryExpression(1, "+", 2)
const identity = new ast.Function("Anna", "id", [], returnX)
const intFun = body => new ast.Function("Anna", "f", [], body)
const callIdentity = (id, args) => new ast.Call(id, args)
const or = (...d) => d.reduce((x, y) => new ast.BinaryExpression(x,"||", y))
const and = (...c) => c.reduce((x, y) => new ast.BinaryExpression(x, "&&", y))
const less = (x, y) => new ast.BinaryExpression(x, "<", y)
const eq = (x, y) => new ast.BinaryExpression(x, "==", y)
const times = (x, y) => new ast.BinaryExpression(x, "*", y)
const neg = x => new ast.UnaryExpression("-", x)
const array = (...elements) => new ast.ArrayExpression(elements)

const tests = [
//   ["folds +", new ast.BinaryExpression(5, "+", 8), 13],
//   ["folds -", new ast.BinaryExpression(5, "-",  8), -3],
//   ["folds *", new ast.BinaryExpression(5, "*", 8), 40],
//   ["folds /", new ast.BinaryExpression(5, "/", 8), 0.625],
//   ["folds **", new ast.BinaryExpression(5, "**", 8), 390625],
//   ["folds <", new ast.BinaryExpression(5, "<", 8), true],
//   ["folds <=", new ast.BinaryExpression(5, "<=", 8), true],
//   ["folds ==", new ast.BinaryExpression(5, "==", 8), false],
//   ["folds !=", new ast.BinaryExpression(5, "!=", 8), true],
//   ["folds >=", new ast.BinaryExpression(5, ">=", 8), false],
//   ["folds >", new ast.BinaryExpression(5, ">", 8), false],
//   ["optimizes +0", new ast.BinaryExpression(x, "+", 0), x],
//   ["optimizes -0", new ast.BinaryExpression(x, "-", 0), x],
//   ["optimizes *1", new ast.BinaryExpression(x, "*", 1), x],
//   ["optimizes /1", new ast.BinaryExpression(x, "/", 1), x],
  // ["optimizes *0", new ast.BinaryExpression(x, "*", 0), 0],
  ["optimizes 0*", new ast.BinaryExpression(0, "*", x), 0],
  ["optimizes 0/", new ast.BinaryExpression(0, "/", x), 0],
  ["optimizes 0+", new ast.BinaryExpression(0, "+",  x), x],
  ["optimizes 0-", new ast.BinaryExpression(0, "-", x), neg(x)],
  ["optimizes 1*", new ast.BinaryExpression(1, "*", x), x],
  ["folds negation", new ast.UnaryExpression("-", 8), -8],
  // ["optimizes 1**", new ast.BinaryExpression(1,"**", x), 1],
  // ["optimizes **0", new ast.BinaryExpression( x, "**", 0), 1],
  // ["removes left false from ||", or(false, less(x, 1)), less(x, 1)],
  // ["removes right false from ||", or(less(x, 1), false), less(x, 1)],
  // ["removes left true from &&", and(true, less(x, 1)), less(x, 1)],
  // ["removes right true from &&", and(less(x, 1), true), less(x, 1)],
  // ["removes x=x at beginning", [new ast.PlainAssignment(x, x), xinc], [xinc]],
  // ["removes x=x at end", [xinc, new ast.PlainAssignment(x, x)], [xinc]],
  // ["removes x=x in middle", [xinc, new ast.PlainAssignment(x, x), xinc], [xinc, xinc]],
  // ["optimizes if-true", new ast.IfStatement(true, xinc, []), xinc],
  // ["optimizes if-false", new ast.IfStatement(false, xinc, []), xinc],
  // ["optimizes while-false", [new ast.WhileLoop(false, xinc)], []],
  // ["applies if-false after folding", new ast.IfStatement(eq(1, 1), xinc, null), xinc],
  // ["optimizes in functions", intFun(return1p1), intFun(return2)],
  // ["optimizes in array literals", array(0, onePlusTwo, 9), array(0, 3, 9)],
  // ["optimizes in arguments", callIdentity([times(3, 5)]), callIdentity([15])],
  // [
  //   "passes through nonoptimizable constructs",
  //   ...Array(2).fill([
  //     new ast.Program([new ast.ShortReturnStatement()]),
  //     new ast.PlainAssignment(x, true),
  //     new ast.PlainAssignment(x, new ast.BinaryExpression(x, "*", z)),
  //     new ast.Call(identity, x),
  //     new ast.Variable("Meltable", "Herd[]", "q", []),
  //     new ast.WhileLoop(true, [new ast.BreakStatement()]),
  //   ]),
  // ],
]

describe("The Optimizer", () => {
  for (const [scenario, before, after] of tests) {
    it(`${scenario}`, () => {
      assert.deepEqual(optimize(before), after)
    })
  }
})