import assert from 'assert'
import parse from '../src/parser.js'
import analyze from '../src/analyzer.js'

const semanticChecks = [
  ['MultiTest', 'Meltable Anna j ❅ Snow S {\nMeltable Herd[] y ❅ \nWater( Anna x ) {\nFrozen.x = x ❅\nFrozen.y.x = 2 ❅\n}\nCrystal Anna fff () {\nArendelle j ❅ }\n}\nMeltable Olaf x = "sds"  ❅ \nUnmeltable Trolls[[]] y = [[1:2 ❅,x:2 ❅,3:2 ❅]] ❅\ny[[x]] = 3.0 ❅\nSing(y.x) ❅'],
  ['Dictionary id as key', 'Meltable Olaf x = "sds"❅ \nUnmeltable Trolls[[]] y = [[1:2 ❅,x:2 ❅,3:2 ❅]] ❅ '],
  ['GetProperty object test', 'Snow S {\nMeltable Herd[] y ❅\nWater( Anna x ) {\nFrozen.x = x ❅\nFrozen.y.x = 2 ❅}} \nUnmeltable Trolls[[]] y = [[1:2 ❅,2:2 ❅,3:2 ❅]] ❅ \nMeltable Olaf x = "sds"  ❅ \ny[[x]] = 3.0 ❅\nSing(y[[x]]) ❅'],
  ['GetProperty mass test', 'Snow S {\nMeltable Herd[] y ❅\nWater( Anna x ) {\nFrozen.x = x ❅\nFrozen.y.x = 2 ❅}}\nUnmeltable Point y = Open~Door S(1) ❅\ny.x = 3 ❅\nSing(y.x) ❅'],
  ['Switch Statement', 'Unmeltable Anna k = 3❅\nAll~Is~Found(k ❅) {\nShow~Yourself(1):\nClosed~Door ❅\nShow~Yourself(2):\nClosed~Door ❅\nShow~Yourself(3):\nClosed~Door ❅\nI~Seek~The~Truth:\nClosed~Door ❅}',],
  ['empty for loop', 'Unmeltable Anna x = 10 ❅\nLet~It~Go (Meltable Anna i = 1 ❅ i < x ❅ i+=1 ❅) {}'],
  ['increment and decrement', 'Meltable Anna x = 10 ❅ x-- ❅ x++ ❅'],
  ['||', 'Sing(Kristoff || 1 < 2 || Hans || !Kristoff) ❅'],
  ['&&', 'Sing(Kristoff && 1 < 2 && Hans && !Kristoff) ❅'],
  ['relations', 'Sing(1 <= 2 && 3.5 < 1.2) ❅'],
  ['arithmetic', 'Unmeltable Anna x = 1 ❅ Sing(2 * 3 + 5.0 ** -3 / 2 - 5.0 % 8) ❅'],
  ['built-in print', 'Sing(1) ❅'],
  [ 
    'member exp',
    `Snow S {Meltable Anna x ❅ Water( Anna x ) {Frozen.x = x ❅}} Unmeltable S y = Open~Door S(1) ❅ Sing(y.x) ❅`,
  ],
  [
    'array of Classes',
    'Snow S {Meltable Anna x ❅ Water( Anna x ) {Frozen.x = x ❅}} Unmeltable Herd[] x = [Open~Door S(1), Open~Door S(3)]❅',
  ],
  ['function return types', `Ice Olaf f(Olaf s) { Arendelle s ❅ } f("Hello") ❅`],
  ['simplest syntactically correct program', 'Closed~Door ❅'],
  ['multiple statements', 'Sing(1) ❅ Closed~Door ❅ x += 3 ❅ Arendelle ❅'],
  [
    'variable declarations',
    `Meltable Olaf x = 2.0 + "3" ❅\n Unmeltable Olaf String~Name = "Who can handle this enormous candle? Unmeltable me" ❅`,
  ],
  [
    'class declarations',
    `Snow Kristyl { Meltable Olaf fjord = "Hello" ❅ Unmeltable Olaf test ❅ Water () {Frozen.test = "tester" ❅} Crystal Anna Ski() { Arendelle 3 ❅ } }`,
  ],
  [
    'function with one param',
    `Ice Olaf Even~Odd(Anna num) { Arendelle "This num is being tested" ❅ }`,
  ],
  [
    'function with two params',
    `Ice Olaf Even~Odd(Anna num, Olaf str) { Arendelle "This num is being tested" ❅ }`,
  ],
  ['function with no params ', `Ice Samantha Even~Odd() {}`],
  ['array type for param', `Ice Samantha Even~Odd(Herd[] Sven) {}`],
  ['dictionary type for param', `Ice Samantha Even~Odd(Trolls[[]] TrollyBoi) {}`],
  ['assignments', 'Meltable Anna abc ❅ \n Meltable Anna a ❅ \n Meltable Anna c ❅\n a--❅ c++❅ abc=9*3❅ a=1❅'],
  ['array type returned', 'Ice Herd[] Even~Odd(Herd[] Boop) { Arendelle Boop ❅}'],
  ['call in statement', 'Ice Samantha f(Anna num) {}\nUnmeltable Anna x = 2 + 3 ❅ \nf(100) ❅\n Sing(1) ❅'],
  ['short if', 'Get~This~Right(Kristoff ❅) { Sing(1) ❅ }'],
  ['longer if', 'Get~This~Right(Kristoff ❅) { Sing(1)❅ } Into~The~Unknown { Sing(2)❅ }'],
  [
    'even longer if',
    'Get~This~Right(Kristoff ❅) { Sing(1)❅ } The~Next~Right~Thing(Hans ❅) { Sing(2)❅ }',
  ],
  ['while with empty block', 'Unmeltable Love a = Kristoff ❅\nLost~In~The~Woods(a ❅) {}'],
]

const semanticErrors = [
  [
    'identifier declared twice',
    'Unmeltable Anna S = 1 ❅\nSnow S {}',
    /Forgetful spirit! S already declared/
  ],
  [
    'class in loop',
    'Lost~In~The~Woods(Hans ❅) {Snow S {}}',
    /Foolish Spirit! You cannot create a class within a Loop!/,
  ],
  [
    'non-distinct fields',
    'Snow Kristyl { Meltable Olaf fjord = "Hello" ❅ Meltable Olaf fjord = "There" ❅}',
    /Duplicate Variable Declaration: Your proposed variable declaration has already been declared, good spirit! Please choose another name!/,
  ],
  [
    'unmutable variable being changed',
    'Unmeltable Elsa x = 3.6 ❅ x = 2.3 ❅',
    /You cannot melt the permafrost bad spirit! It simply cannot melt!/,
  ],
  ['non-number increment', 'Meltable Love isGood = Kristoff ❅ isGood++ ❅',
    /Expected Anna or Elsa, but found Love. Please summon Anna or Elsa, good spirit!/],
  [
    'non-number decrement',
    'Meltable Olaf x = "I like telling stories!" ❅ x++ ❅',
    /Expected Anna or Elsa, but found Olaf. Please summon Anna or Elsa, good spirit!/,
  ],
  ['undeclared id', 'Sing(x) ❅', /Identifier x not declared/],
  [
    'redeclared id',
    'Unmeltable Anna x = 1 ❅ Unmeltable Anna x = 1 ❅',
    /Duplicate Variable Declaration: Your proposed variable declaration has already been declared, good spirit! Please choose another name!/,
  ],
  ['assign bad type', 'Meltable Anna x = 1 ❅ x = Kristoff ❅',
    /Excuse me old spirit, it appears that your declared variable type and your chosen expression are not the same! How embarrassing!/],
  [
    'return value from void function',
    'Ice Samantha f() {Arendelle "Return!" ❅}',
    /You must return Samantha! You simply must bad spirit!/,
  ],
  ['return nothing from non-void', 'Ice Olaf f() {Arendelle ❅}', /You must return Samantha! You simply must bad spirit!/],
  ['return type mismatch', 'Ice Anna f() {Arendelle Hans ❅}', /You must return Anna! You simply must bad spirit!/],
  ['bad types for +', 'Sing(Hans + 1) ❅', /Expected Anna, Elsa or Olaf, but found Love. Please summon Anna, Elsa or Olaf, good spirit!/],
  ['bad types for -', 'Sing(1.0 - Hans) ❅', /Expected Anna or Elsa, but found Love. Please summon Anna or Elsa, good spirit!/],
  ['bad types for *', 'Sing(Hans*1) ❅', /Expected Anna or Elsa, but found Love. Please summon Anna or Elsa, good spirit!/],
  ['bad types for /', 'Sing(Hans/1) ❅', /Expected Anna or Elsa, but found Love. Please summon Anna or Elsa, good spirit!/],
  ['bad types for **', 'Sing(Hans**1) ❅', /Expected Anna or Elsa, but found Love. Please summon Anna or Elsa, good spirit!/],
  ['bad types for <', 'Sing(Hans<1) ❅', /Expected Anna or Elsa, but found Love. Please summon Anna or Elsa, good spirit!/],
  ['bad types for <=', 'Sing(Hans<=1) ❅', /Expected Anna or Elsa, but found Love. Please summon Anna or Elsa, good spirit!/],
  ['bad types for >', 'Sing(Hans>1) ❅', /Expected Anna or Elsa, but found Love. Please summon Anna or Elsa, good spirit!/],
  ['bad types for >=', 'Sing(Hans>=1) ❅', /Expected Anna or Elsa, but found Love. Please summon Anna or Elsa, good spirit!/],
  ['bad types for negation', 'Sing(-Kristoff) ❅', /Expected Anna or Elsa, but found Love. Please summon Anna or Elsa, good spirit!/],
  [
    'identifier not declared',
    'Snow Point{ Water() {}} Meltable Point x = Open~Door Point() ❅ Sing(x, y) ❅',
    /Identifier y not declared/,
  ],
  [
    'shadowing',
    'Unmeltable Anna x = 1 ❅ \n Lost~In~The~Woods(Kristoff ❅) {Unmeltable Anna x = 1 ❅}',
    /Duplicate Variable Declaration: Your proposed variable declaration has already been declared, good spirit! Please choose another name!/,
  ],
  ['Too many args', 'Ice Samantha f(Anna x){}\nf(1,2) ❅', /Excuse me old spirit, you have too many arguments to call f./],
  ['Too many args', 'Ice Samantha f(){}\nf(1) ❅', /Excuse me old spirit, you have too many arguments to call f./],
  [
    'Too few args',
    'Ice Samantha f(Anna x, Anna y){} \nf() ❅',
    /Excuse me old spirit, you have too few arguments to call f./,
  ],
  [
    'Parameter type mismatch',
    'Ice Samantha f(Anna num) {}\nf(Hans) ❅',
    /Excuse me old spirit, the type of your argument 'Hans' does not match the required type 'Anna'./,
  ],
  [
    'New Instance, no constructor',
    'Snow Point{ }\nMeltable Point x = Open~Door Point() ❅ ',
    /Excuse me forgetful spirit. Your instance has no constructor! How embarrassing!/,
  ],
  [
    'NewInstance, type mismatch',
    'Snow Point{ Water(Anna b) {}}\nMeltable Point x = Open~Door Point(1.01) ❅',
    /Excuse me old spirit, the type of your argument '1.01' does not match the required type 'Anna'./
  ],
  [
  'NewInstance, too few args',
  'Snow Point{ Water(Anna b) {}}\nMeltable Point x = Open~Door Point() ❅ ',
  /Excuse me old spirit, you have too few arguments to instantiate Point./,
  ],
  [
    'NewInstance, too many args',
    'Snow Point{ Water() {}}\nMeltable Point x = Open~Door Point(1) ❅ ',
    /Excuse me old spirit, you have too many arguments to instantiate Point./,
  ],
  [
    'NewInstance of a non class',
    'Unmeltable Anna Point = x ❅\nMeltable Point x = Open~Door Point() ❅',
    /Bad spirit! Cannot create a new instance of 'Point' when there is no Snow!/
  ],
  [
    'Switch Statement, bad case type',
    'Unmeltable Love k = Kristoff❅\nUnmeltable Love y = Hans ❅\nUnmeltable Samantha z ❅\nAll~Is~Found(k ❅) {\nShow~Yourself(1):\nClosed~Door ❅\nShow~Yourself(y):\nClosed~Door ❅\nShow~Yourself(z):\nClosed~Door ❅\nI~Seek~The~Truth:\nClosed~Door ❅}',
    /Expected Anna, Elsa, Olaf, or Love, but found Samantha. Please summon Anna, Elsa, Olaf or some Love, good spirit!/
  ],
  [
    'Get Property [] not Herd',
    'Snow S {\nMeltable Herd[] y ❅\nWater( Anna x ) {\nFrozen.x = x ❅\nFrozen.y.x = 2 ❅}}\nUnmeltable Trolls[[]] y = [[1:2 ❅,3:4 ❅,5:6 ❅]] ❅ \nMeltable Elsa x = 1.0  ❅ \ny[x] = 3.0 ❅\nSing(y.x) ❅',
    /Expected a Herd, but found otherwise. Please summon the Herd, good spirit!/
  ],
  [
    'Get Property [] not int',
    'Snow S {\nMeltable Herd[] y ❅\nWater( Anna x ) {\nFrozen.x = x ❅\nFrozen.y.x = 2 ❅\n}\n}\nUnmeltable Herd[] y = [1,2,3,4,5] ❅\nMeltable Elsa x = 1.0  ❅\ny[x] = 3.0 ❅\nSing(y.x) ❅',
    /Expected Anna, but found Elsa. Please summon Anna to get Sven from the Herd, good spirit!/
  ],
]

describe('The Analyzer', () => {
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
})