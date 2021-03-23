import assert from "assert"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"
import * as ast from "../src/ast.js"

const semanticChecks = [
  ["increment and decrement", "Meltable Anna x = 10 ❅ x-- ❅ x++ ❅"],
  ["||", "Sing(Kristoff || 1 < 2 || Hans || !Kristoff) ❅"],
  ["&&", "Sing(Kristoff && 1 < 2 && Hans && !Kristoff) ❅"],
  ["relations", 'Sing(1 <= 2 && 3.5 < 1.2) ❅'],
  ["arithmetic", "Unmeltable Anna x = 1 ❅ Sing(2 * 3 + 5 ** -3 / 2 - 5 % 8) ❅"],
  ["variables", "Unmeltable Herd[] x = [[[[1]]]] ❅ Sing(x[0][0][0][0] + 2) ❅"],
  ["built-in print", "Sing(1) ❅"],
  ["member exp", `Snow S {Meltable Anna x ❅ Water( Anna x ) {Frozen.x = x ❅}} Unmeltable S y = Open~Door S(1) ❅ print(y.x) ❅`],
  ["array of Classes", "Snow S {Meltable Anna x ❅ Water( Anna x ) {Frozen.x = x ❅}} Unmeltable Herd[] x = [Open~Door S(1), Open~Door S(3)]❅"],
  [ "function return types", `Ice Olaf f(Olaf s) { Arendelle s ❅ }`,],  
  ["simplest syntactically correct program", "Closed~Door ❅"],
  ["multiple statements", "Sing(1) ❅ Closed~Door ❅ x += 3 ❅ Arendelle ❅"],
  ["variable declarations", `Meltable Anna x = 2 + 3 ❅\n Unmeltable Olaf String~Name = "Who can handle this enormous candle? Unmeltable me" ❅`],
  ["class declarations", `Snow Kristyl { Meltable Olaf fjord = "Hello" ❅ Unmeltable Olaf test ❅ Water () {Frozen.test = "tester" ❅} Crystal Anna Ski() { Arendelle 3 ❅ } }`],
  ["function with one param", `Ice Olaf Even~Odd(Anna num) { Arendelle "This num is being tested" ❅ }`],
  ["function with two params", `Ice Olaf Even~Odd(Anna num, Olaf str) { Arendelle "This num is being tested" ❅ }`],
  ["function with no params ", `Ice Samantha Even~Odd() {}`],
  ["array type for param", `Ice Samantha Even~Odd(Herd[] Sven) {}`],
  ["dictionary type for param", `Ice Samantha Even~Odd(Trolls[[]] TrollyBoi) {}`],
  ["assignments", "a--❅ c++❅ abc=9*3❅ a=1❅"],
  ["array type returned", "Ice Herd[] Even~Odd(Herd[] Boop) { Arendelle Boop ❅}"],
  ["call in statement", "Unmeltable Anna x = 2 + 3 ❅ \nf(100) ❅\n Sing(1) ❅"],
  ["call in exp", "Sing(5 * f(x, y, 2 * y) ❅ ) ❅"],
  ["short if", "Get~This~Right(Kristoff ❅) { Sing(1) ❅ }"],
  ["longer if", "Get~This~Right(Kristoff ❅) { Sing(1)❅ } Into~The~Unknown { Sing(2)❅ }"],
  ["even longer if", "Get~This~Right(Kristoff ❅) { Sing(1)❅ } The~Next~Right~Thing(Hans ❅) { Sing(2)❅ }"],
  ["while with empty block", "Lost~In~The~Woods(Hans ❅) {}"],
]

const semanticErrors = [
  ["non-distinct fields", 'Snow Kristyl { Meltable Olaf fjord = "Hello" ❅ Meltable Olaf fjord = "There" ❅}', /Fields must be distinct/],
  ["unmutable variable being changed", 'Unmeltable Elsa x = 3.6 ❅ x = 2.3', /Cannot assign to constant x/],
  ["non-int increment", 'Meltable Love isGood = Kristoff ❅ x++ ❅', /an integer, found boolean/],
  ["non-int decrement", 'Meltable Olaf x = "I like telling stories!" ❅ x++ ❅', /an integer, found [string]?/],
  ["undeclared id", "Sing(x) ❅", /Identifier x not declared/],
  ["redeclared id", "Unmeltable Anna x = 1 ❅ Unmeltable Anna x = 1 ❅", /Identifier x already declared/],
  ["assign bad type", "Unmeltable Anna x = 1 ❅ Anna x = Kristoff ❅", /Cannot assign a boolean to a int/],
  ["return outside function", "Arendelle ❅", /Return can only appear in a function/],
  ["return value from void function", 'Ice Samantha f() {Arendelle "Return!"} ❅', /Cannot return a value here/],
  ["return nothing from non-void", 'Ice Olaf f() {Arendelle ❅}', /should be returned here/],
  ["return type mismatch", "Ice Ana f() {Arendelle Hans ❅}", /boolean to a int/],
  ["non-boolean short if test", "Get~This~Right(1) {}", /a boolean, found int/],
  ["non-boolean if test", "Get~This~Right(1) {} Into~The~Unknown {}", /a boolean, found int/],
  ["non-boolean while test", "Lost~In~The~Woods(1) {}", /a boolean, found int/],
  ["bad types for ||", "Sing(Hans||1) ❅", /a boolean, found int/],
  ["bad types for &&", "Sing(Hans&&1) ❅", /a boolean, found int/],
  ["bad types for ==", "Sing(Hans==1) ❅", /Operands do not have the same type/],
  ["bad types for !=", "Sing(Hans==1) ❅", /Operands do not have the same type/],
  ["bad types for +", "Sing(Hans+1) ❅", /number or string, found boolean/],
  ["bad types for -", "Sing(Hans-1) ❅", /a number, found boolean/],
  ["bad types for *", "Sing(Hans*1) ❅", /a number, found boolean/],
  ["bad types for /", "Sing(Hans/1) ❅", /a number, found boolean/],
  ["bad types for **", "Sing(Hans**1) ❅", /a number, found boolean/],
  ["bad types for <", "Sing(Hans<1) ❅", /number or string, found boolean/],
  ["bad types for <=", "Sing(Hans<=1) ❅", /number or string, found bool/],
  ["bad types for >", "Sing(Hans>1) ❅", /number or string, found bool/],
  ["bad types for >=", "Sing(Hans>=1) ❅", /number or string, found bool/],
  ["bad types for ==", "Sing(2==2.0) ❅", /not have the same type/],
  ["bad types for !=", "Sing(Hans!=1) ❅", /not have the same type/],
  ["bad types for negation", "Sing(-Kristoff) ❅", /a number, found boolean/],
  ["bad types for not", 'Sing(!"hello") ❅', /a boolean, found string/],
  ["non-integer index", "Meltable Herd[] a=[1] ❅ Sing(a[Hans]) ❅", /integer, found boolean/],
  ["no such field", 'Snow Point{ } Meltable Point x = Open~Door Point() ❅ Sing(x.y) ❅', /No such field/],
  ["shadowing", "Unmeltable Anna x = 1 ❅ \n Lost~In~The~Woods(true) {Unmeltable Anna x = 1 ❅}", /Identifier x already declared/],
  ["call of uncallable", "Unmeltable Anna x = 1 ❅ \n Sing(x()) ❅", /Call of non-function/],
  ["Too many args","Ice Samantha f(Anna x){}\nf(1,2) ❅",/1 argument\(s\) required but 2 passed/],
  ["Too many args","Ice Samantha f(){}\nf(1) ❅",/No argument\(s\) required but 1 passed/],
  ["Too few args","Ice Samantha f(Anna x, Anna y){} \nf() ❅",/1 argument\(s\) required but 0 passed/],
  ["Parameter type mismatch","Ice Samantha f(Anna num) {}\nf(Hans);", /Cannot assign a boolean to a int/], 
]

// Test cases for expected semantic graphs after processing the AST. In general
// this suite of cases should have a test for each kind of node, including
// nodes that get rewritten as well as those that are just "passed through"
// by the analyzer. For now, we're just testing the various rewrites only.



// Program
// Variable
// Expression
// ReturnStatement
// PlainAssignment
// Function
// Body
// Class
// Constructor
// Method
// Field
// IfStatement
// WhileLoop
// AccessDot
// AccessInt
// AccessKeyValue
// ForLoop
// SwitchStatement
// BreakStatement
// NewInstance
// Array
// Dictionary
// Incrementer
// IncrementalAssignment
// Relation
// Expression2_logicalop
// Expression4_addop
// Expression5_mulop
// Expression6_exp
// Expression8_negop
// Expression9_prefixop
// Identifier
// GetProperty
// ParenthesisExpression
// DictionaryEntry
// DictionaryEntries
// Parameter
// Parameters
// Arguments
// string
// float
// _terminal
// Call













// const Int = ast.Type.INT
// const Void = ast.Type.VOID
// const intToVoidType = new ast.FunctionType([Int], Void)

// const varX = Object.assign(new ast.Variable("x", false), { type: Int })

// const letX1 = Object.assign(new ast.VariableDeclaration("x", false, 1n), {
//   variable: varX,
// })
// const assignX2 = new ast.Assignment(varX, 2n)

// const funDeclF = Object.assign(
//   new ast.FunctionDeclaration("f", [new ast.Parameter("x", Int)], Void, []),
//   {
//     function: Object.assign(new ast.Function("f"), {
//       type: intToVoidType,
//     }),
//   }
// )

// const structS = new ast.StructDeclaration("S", [new ast.Field("x", Int)])




const graphChecks = [
  ["Variable created & resolved", "let x=1; x=2;", [letX1, assignX2]],
  ["functions created & resolved", "function f(x: int) {}", [funDeclF]],
  ["field type resolved", "struct S {x: int}", [structS]],
  
]

describe("The analyzer", () => {
  for (const [scenario, source] of semanticChecks) {
    it(`recognizes ${scenario}`, () => {
      assert.ok(analyze(parse(source)))
    })
  }
  for (const [scenario, source, errorMessagePattern] of semanticErrors) {
    it(`throws on ${scenario}`, () => {
      assert.throws(() => analyze(parse(source)), errorMessagePattern)
    })
  }
  for (const [scenario, source, graph] of graphChecks) {
    it(`properly rewrites the AST for ${scenario}`, () => {
      assert.deepStrictEqual(analyze(parse(source)), new ast.Program(graph))
    })
  }
})