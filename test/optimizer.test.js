import assert from "assert"
import optimize from "../src/optimizer.js"
import * as ast from "../src/ast.js"

const x = new ast.Variable("Meltable", "Anna", "x", null)
const y = new ast.Variable("Meltable", "Anna", "y", new ast.Integer(1))
const z = new ast.Variable("Meltable", "Anna", "z", null)
const xinc = new ast.Incrementer(x, "++")
const xdec = new ast.Incrementer(x, "--")
const yinc = new ast.Incrementer(y, "++")
const incAss = new ast.IncrementalAssignment(y, "+=", new ast.Integer(3))
const return1p1 = new ast.ReturnStatement(new ast.BinaryExpression(new ast.Integer(1), "+", new ast.Integer(1)))
const return2 = new ast.ReturnStatement(new ast.Integer(2))
const returnX = new ast.ReturnStatement(x)
const onePlusTwo = new ast.BinaryExpression(new ast.Integer(1), "+", new ast.Integer(2))
const identity = new ast.Function("Anna", "id", [], returnX)
const param = new ast.Parameter(new ast.Type("ANNA"), "x")
const paramz = new ast.Parameters(param)
const dictEntry = new ast.DictionaryEntry("x", onePlusTwo)
const dictEntries = new ast.DictionaryEntries([dictEntry])
const dictz = new ast.Dictionary(dictEntries)
const fieldz = new ast.Field(x)
const methodz = new ast.Method("Anna", "getLength", paramz, [y])
const constructz = new ast.Constructor(paramz, [])
const clazz = new ast.Snow("Point", [fieldz, constructz, methodz])
const switchz = new ast.SwitchStatement(onePlusTwo, [onePlusTwo], [], [])
const intFun = body => new ast.Function("Anna", "f", paramz, body)
const argz = new ast.Arguments(new ast.Argument(x, y))
const callIdentity = (id, args) => new ast.Call(id, args)
const or = (...d) => d.reduce((x, y) => new ast.BinaryExpression(x, "||", y))
const and = (...c) => c.reduce((x, y) => new ast.BinaryExpression(x, "&&", y))
const less = (x, y) => new ast.BinaryExpression(x, "<", y)
const eq = (x, y) => new ast.BinaryExpression(x, "==", y)
const times = (x, y) => new ast.BinaryExpression(x, "*", y)
const neg = x => new ast.UnaryExpression("-", x)
const array = (...elements) => new ast.ArrayExpression(elements)
const newInz = new ast.NewInstance("weNew", argz)
const loopy = new ast.ForLoop(y, new ast.Integer(5), yinc, onePlusTwo)
const accezz = new ast.Access("c", ".")

const tests = [
  ["folds +", new ast.BinaryExpression(new ast.Integer(5), "+", new ast.Integer(8)), new ast.Float(13)],
  ["folds -", new ast.BinaryExpression(new ast.Integer(5), "-", new ast.Integer(8)), new ast.Float(-3)],
  ["folds *", new ast.BinaryExpression(new ast.Integer(5), "*", new ast.Integer(8)), new ast.Float(40)],
  ["folds /", new ast.BinaryExpression(new ast.Integer(5), "/", new ast.Integer(8)), new ast.Float(0.625)],
  ["folds **", new ast.BinaryExpression(new ast.Integer(5), "**", new ast.Integer(8)), new ast.Float(390625)],
  ["folds <", new ast.BinaryExpression(new ast.Integer(5), "<", new ast.Integer(8)), new ast.Booley("Kristoff")],
  ["folds <=", new ast.BinaryExpression(new ast.Integer(5), "<=", new ast.Integer(8)), new ast.Booley("Kristoff")],
  ["folds ==", new ast.BinaryExpression(new ast.Integer(5), "==", new ast.Integer(8)), new ast.Booley("Hans")],
  ["folds !=", new ast.BinaryExpression(new ast.Integer(5), "!=", new ast.Integer(8)), new ast.Booley("Kristoff")],
  ["folds >=", new ast.BinaryExpression(new ast.Integer(5), ">=", new ast.Integer(8)), new ast.Booley("Hans")],
  ["folds >", new ast.BinaryExpression(new ast.Integer(5), ">", new ast.Integer(8)), new ast.Booley("Hans")],
  ["optimizes +0", new ast.BinaryExpression(x, "+", new ast.Integer(0)), x],
  ["optimizes -0", new ast.BinaryExpression(x, "-", new ast.Integer(0)), x],
  ["optimizes *1", new ast.BinaryExpression(x, "*", new ast.Integer(1)), x],
  ["optimizes /1", new ast.BinaryExpression(x, "/", new ast.Integer(1)), x],
  ["optimizes *0", new ast.BinaryExpression(x, "*", new ast.Integer(0)), new ast.Float(0)],
  ["optimizes 0*", new ast.BinaryExpression(new ast.Integer(0), "*", x), new ast.Float(0)],
  ["optimizes 0/", new ast.BinaryExpression(new ast.Integer(0), "/", x), new ast.Float(0)],
  ["optimizes 0+", new ast.BinaryExpression(new ast.Integer(0), "+", x), x],
  ["optimizes 0-", new ast.BinaryExpression(new ast.Integer(0), "-", x), neg(x)],
  ["optimizes 1*", new ast.BinaryExpression(new ast.Integer(1), "*", x), x],
  ["folds negation", new ast.UnaryExpression("-", new ast.Integer(8)), new ast.Float(-8)],
  ["optimizes 1**", new ast.BinaryExpression(new ast.Integer(1), "**", x), new ast.Float(1)],
  ["optimizes **0", new ast.BinaryExpression(x, "**", new ast.Integer(0)), new ast.Float(1)],
  ["removes left false from ||", or(new ast.Booley("Hans"), less(x, new ast.Integer(1))), less(x, new ast.Float(1))],
  ["removes right false from ||", or(less(x, new ast.Integer(1)), new ast.Booley("Hans")), less(x, new ast.Float(1))],
  ["bails true for || right true", or(less(x, new ast.Integer(1)), new ast.Booley("Kristoff")), new ast.Booley("Kristoff")],
  ["bails true for || left true", or(new ast.Booley("Kristoff"), less(x, new ast.Integer(1))), new ast.Booley("Kristoff")],
  ["bails false for && right false", and(less(x, new ast.Integer(1)), new ast.Booley("Hans")), new ast.Booley("Hans")],
  ["bails false for && left false", and(new ast.Booley("Hans"), less(x, new ast.Integer(1))), new ast.Booley("Hans")],
  ["removes left true from &&", and(new ast.Booley("Kristoff"), less(x, new ast.Integer(1))), less(x, new ast.Float(1))],
  ["removes right true from &&", and(less(x, new ast.Integer(1)), new ast.Booley("Kristoff")), less(x, new ast.Float(1))],
  ["removes x=x at beginning", [new ast.PlainAssignment(x, x), xinc], [xinc]],
  ["removes x=x at end", [xinc, new ast.PlainAssignment(x, x)], [xinc]],
  ["removes x=x in middle", [xinc, new ast.PlainAssignment(x, x), xinc], [xinc, xinc]],
  ["optimizes if-true", new ast.IfStatement([new ast.Booley("Kristoff")], [xinc], []), xinc],
  ["optimizes if-false", new ast.IfStatement([new ast.Booley("Hans")], [], [xinc]), [xinc]],
  ["optimizes while-false", new ast.WhileLoop(new ast.Booley("Hans"), [xinc]), []],
  ["applies if-false after folding", new ast.IfStatement([eq(new ast.Integer(1), new ast.Integer(1))], [xinc], []), xinc],
  ["optimizes in functions", intFun(return1p1), intFun(return2)],
  ["optimizes in array literals", array(new ast.Integer(0), onePlusTwo, new ast.Integer(9)), array(new ast.Float(0), new ast.Float(3), new ast.Float(9))],
  ["optimizes in arguments", callIdentity("Sing", [times(new ast.Integer(3), new ast.Integer(5))]), callIdentity("Sing", [new ast.Float(15)])],
  [
    "passes through nonoptimizable constructs",
    ...Array(2).fill([
      new ast.Program([new ast.ShortReturnStatement()]),
      new ast.PlainAssignment(x, new ast.Booley("Kristoff")),
      new ast.PlainAssignment(y, new ast.Integer(1)),
      new ast.PlainAssignment(x, new ast.BinaryExpression(x, "*", z)),
      new ast.Call(identity, x),
      new ast.Variable("Meltable", "Herd[]", "q", []),
      new ast.WhileLoop(new ast.Booley("Kristoff"), [new ast.BreakStatement()]),
      new ast.GetProperty(x, accezz),
      incAss,
      callIdentity("Sing", argz),
      intFun([]),
      new ast.Variable("Meltable", "Herd[[]]", "x", dictz),
      new ast.IfStatement(less(x, y), [xinc], [xdec]),
      clazz,
      newInz,
      loopy,
      switchz,
    ]),
  ],
]

describe("The Optimizer", () => {
  for (const [scenario, before, after] of tests) {
    it(`${scenario}`, () => {
      assert.deepEqual(optimize(before), after)
    })
  }
})