import assert from "assert"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"
import * as ast from "../src/ast.js"

const semanticChecks = [
  ["simplest syntactically correct program", "break"],
  ["multiple statements", "print(1);\nbreak;\nx=5; return; return;"],
  ["variable declarations", "let e=99*1;\nconst z=false;"],
  ["struct declarations", "struct S {x:T1 y:T2 z:bool}"],
  ["function with no params, no return type", "function f() {}"],
  ["function with one param", "function f(x: int) {}"],
  ["function with two params", "function f(x: int, y: boolean) {}"],
  ["function with no params + return type", "function f(): int {}"],
  ["function types in params", "function f(g: (int)->boolean) {}"],
  ["function types returned", "function f(): (int)->(int)->void {}"],

]

const semanticErrors = [
  ["non-distinct fields", 'Snow Kristyl { Meltable Olaf fjord = "Hello" ❅ Meltable Olaf fjord = "There" ❅}', /Fields must be distinct/],
  ["unmutable variable being changed", 'Unmeltable Elsa x = 3.6 ❅ x = 2.3', /Cannot assign to constant x/],
  ["non-int increment", 'Meltable Love isGood = Kristoff ❅ x++ ❅', /an integer, found boolean/],
  ["non-int decrement", 'Meltable Olaf x = "I like telling stories!" ❅ x++ ❅', /an integer, found [string]?/],
  ["undeclared id", "Sing(x) ❅", /Identifier x not declared/],
  ["redeclared id", "Unmeltable Anna x = 1 ❅ Unmeltable Anna x = 1 ❅", /Identifier x already declared/],
  ["assign bad type", "Unmeltable Anna x = 1 ❅ Anna x = Kristoff ❅", /Cannot assign a boolean to a int/],
  ["assign bad array type", "let x=1;x=[true];", /Cannot assign a \[boolean\] to a int/],
  ["assign bad optional type", "let x=1;x=some 2;", /Cannot assign a int\? to a int/],
  ["break outside loop", "break;", /Break can only appear in a loop/],
  [
    "break inside function",
    "while true {function f() {break;}}",
    /Break can only appear in a loop/,
  ],
  ["return outside function", "return;", /Return can only appear in a function/],
  [
    "return value from void function",
    "function f() {return 1;}",
    /Cannot return a value here/,
  ],
  [
    "return nothing from non-void",
    "function f(): int {return;}",
    /should be returned here/,
  ],
  ["return type mismatch", "function f(): int {return false;}", /boolean to a int/],
  ["non-boolean short if test", "if 1 {}", /a boolean, found int/],
  ["non-boolean if test", "if 1 {} else {}", /a boolean, found int/],
  ["non-boolean while test", "while 1 {}", /a boolean, found int/],
  ["non-integer repeat", 'repeat "1" {}', /an integer, found string/],
  ["non-integer low range", "for i in true...2 {}", /an integer, found boolean/],
  ["non-integer high range", "for i in 1..<no int {}", /an integer, found int\?/],
  ["non-array in for", "for i in 100 {}", /Array expected/],
  ["non-boolean conditional test", "print(1?2:3);", /a boolean, found int/],
  ["diff types in conditional arms", "print(true?1:true);", /not have the same type/],
  ["unwrap non-optional", "print(1??2);", /Optional expected/],
  ["bad types for ||", "print(false||1);", /a boolean, found int/],
  ["bad types for &&", "print(false&&1);", /a boolean, found int/],
  ["bad types for ==", "print(false==1);", /Operands do not have the same type/],
  ["bad types for !=", "print(false==1);", /Operands do not have the same type/],
  ["bad types for +", "print(false+1);", /number or string, found boolean/],
  ["bad types for -", "print(false-1);", /a number, found boolean/],
  ["bad types for *", "print(false*1);", /a number, found boolean/],
  ["bad types for /", "print(false/1);", /a number, found boolean/],
  ["bad types for **", "print(false**1);", /a number, found boolean/],
  ["bad types for <", "print(false<1);", /number or string, found boolean/],
  ["bad types for <=", "print(false<=1);", /number or string, found bool/],
  ["bad types for >", "print(false>1);", /number or string, found bool/],
  ["bad types for >=", "print(false>=1);", /number or string, found bool/],
  ["bad types for ==", "print(2==2.0);", /not have the same type/],
  ["bad types for !=", "print(false!=1);", /not have the same type/],
  ["bad types for negation", "print(-true);", /a number, found boolean/],
  ["bad types for length", "print(#false);", /Array expected/],
  ["bad types for not", 'print(!"hello");', /a boolean, found string/],
  ["non-integer index", "let a=[1];print(a[false]);", /integer, found boolean/],
  ["no such field", "struct S{} let x=S(); print(x.y);", /No such field/],
  ["diff type array elements", "print([3,3.0]);", /Not all elements have the same type/],
  ["shadowing", "let x = 1;\nwhile true {let x = 1;}", /Identifier x already declared/],
  ["call of uncallable", "let x = 1;\nprint(x());", /Call of non-function/],
  [
    "Too many args",
    "function f(x: int) {}\nf(1,2);",
    /1 argument\(s\) required but 2 passed/,
  ],
  [
    "Too few args",
    "function f(x: int) {}\nf();",
    /1 argument\(s\) required but 0 passed/,
  ],
  [
    "Parameter type mismatch",
    "function f(x: int) {}\nf(false);",
    /Cannot assign a boolean to a int/,
  ],
  [
    "function type mismatch",
    `function f(x: int, y: (boolean)->void): int { return 1; }
     function g(z: boolean): int { return 5; }
     f(2, g);`,
    /Cannot assign a \(boolean\)->int to a \(boolean\)->void/,
  ],
  ["bad call to stdlib sin()", "print(sin(true));", /Cannot assign a boolean to a float/],
  ["Non-type in param", "let x=1;function f(y:x){}", /Type expected/],
  ["Non-type in return type", "let x=1;function f():x{return 1;}", /Type expected/],
  ["Non-type in field type", "let x=1;struct S {y:x}", /Type expected/],
]

// Test cases for expected semantic graphs after processing the AST. In general
// this suite of cases should have a test for each kind of node, including
// nodes that get rewritten as well as those that are just "passed through"
// by the analyzer. For now, we're just testing the various rewrites only.

const graphChecks = [
  
]



// describe("The analyzer", () => {
//   for (const [scenario, source] of semanticChecks) {
//     it(`recognizes ${scenario}`, () => {
//       assert.ok(analyze(parse(source)))
//     })
//   }
//   for (const [scenario, source, errorMessagePattern] of semanticErrors) {
//     it(`throws on ${scenario}`, () => {
//       assert.throws(() => analyze(parse(source)), errorMessagePattern)
//     })
//   }
//   for (const [scenario, source, graph] of graphChecks) {
//     it(`properly rewrites the AST for ${scenario}`, () => {
//       assert.deepStrictEqual(analyze(parse(source)), new ast.Program(graph))
//     })
//   }
// })