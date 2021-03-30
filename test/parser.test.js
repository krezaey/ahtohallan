import assert from 'assert';
import parse, { syntaxIsOkay } from '../src/parser.js';

const goodPrograms = [
  `Unmeltable Anna x = -2 + 3 ❅`,
  `Unmeltable Anna x = 1 ❅

  `,
  `Meltable Love bool = Hans ❅`,
  `~* This is a comment *~`,
  `Let~It~Go (Meltable Anna i = 1 ❅ i < 10 ❅ i+=1 ❅) {}`,
  `Get~This~Right (x < 1 ❅) { Sing("X is less than 1!") ❅ } `,
  `Lost~In~The~Woods (x == Kristoff ❅) {}`,
  `Meltable Herd[] me = ["Carrot", "Coal", "Twigs", "Warm Hugs"] ❅`,
  `Meltable Elsa n = Samantha ❅`,
  `Unmeltable Love x = !Hans ❅`,
  `Meltable Herd[] Mixed~Casing = [2, "Sven", 1.7, Kristoff] ❅ Sing(Mixed~Casing[0]) ❅`,
  `All~Is~Found(expression ❅) { Show~Yourself(Hans): Arendelle "Hello" ❅ Closed~Door ❅ Show~Yourself(Kristoff): Arendelle "There" ❅ Closed~Door ❅ I~Seek~The~Truth:  Arendelle "Again" ❅  Closed~Door ❅}`,
  `~* This is   a comment  *~`,
  `~* This * is also * a comment *~`,
  `Meltable Anna abc = -10 ❅`,
  `Meltable Love bool = !Hans ❅`,
  `Ice Olaf Even~Odd(Anna num) { Arendelle "This num is being tested" ❅ }`,
  `Even~Odd(5) ❅`,
  `Odd~Even() ❅`,
  `hi++ ❅`,
  `Arendelle Open~Door Point() ❅`,
  `Snow Kristyl { Meltable Olaf fjord = "Hello" ❅ Unmeltable Olaf test ❅ Water () {Frozen.test = "tester" ❅} Crystal Anna Ski() { Arendelle 3 ❅ } }`,
  `Unmeltable Trolls[[]] annaLoveHistory = [["Hans loved Anna." : Hans ❅ , "Kristoff loves Anna." : Kristoff ❅]] ❅ Sing(annaLoveHistory[["Hans loved Anna."]]) ❅`,
  `x += 1 ❅`,
  `Meltable Anna NotBool = (3) ❅`,
  `Get~This~Right (x < 1 ❅) { Sing("X is less than 1!") ❅ } The~Next~Right~Thing (y > 3 ❅) {Sing("Y is greater than 3!") ❅ } Into~The~Unknown { Sing("X is not 1 or 3 or a number!") ❅ }`,
  `Meltable Anna x = 10 ❅ x-- ❅ x++ ❅`,
  `Sing(Kristoff || 1 < 2 || Hans || !Kristoff) ❅`,
  `Sing(Kristoff && 1 < 2 && Hans && !Kristoff) ❅`,
  `Sing(1 <= 2 && 3.5 < 1.2) ❅`,
  `Unmeltable Anna x = 1 ❅ Sing(2 * 3 + 5 ** -3 / 2 - 5 % 8) ❅`,
  `Unmeltable Herd[] x = [[[[1]]]] ❅ Sing(x[0][0][0][0] + 2) ❅`,
  `Sing(1) ❅`,
  `Snow S {Meltable Anna x ❅ Water( Anna x ) {Frozen.x = x ❅}} Unmeltable S y = Open~Door S(1) ❅ print(y.x) ❅`,
  `Snow S {Meltable Anna x ❅ Water( Anna x ) {Frozen.x = x ❅}} Unmeltable Herd[] x = [Open~Door S(1), Open~Door S(3)]❅`,
  `Ice Olaf f(Olaf s) { Arendelle s ❅ }`,
  `Closed~Door ❅`,
  `Sing(1) ❅ Closed~Door ❅ x += 3 ❅ Arendelle ❅`,
  `Meltable Anna x = 2 + 3 ❅ Unmeltable Olaf String~Name = "Who can handle this enormous candle? Unmeltable me" ❅`,
  `Snow Kristyl { Meltable Olaf fjord = "Hello" ❅ Unmeltable Olaf test ❅ Water () {Frozen.test = "tester" ❅} Crystal Anna Ski() { Arendelle 3 ❅ } }`,
  `Ice Olaf Even~Odd(Anna num) { Arendelle "This num is being tested" ❅ }`,
  `Ice Olaf Even~Odd(Anna num, Olaf str) { Arendelle "This num is being tested" ❅ }`,
  `Ice Samantha Even~Odd() {}`,
  `Ice Samantha Even~Odd(Herd[] Sven) {}`,
  `Ice Samantha Even~Odd(Trolls[[]] TrollyBoi) {}`,
  `a-- ❅ c++ ❅ abc = 9 * 3 ❅ a = 1 ❅`,
  `Ice Herd[] Even~Odd(Herd[] Boop) {Arendelle Boop ❅}`,
  `Unmeltable Anna x = 2 + 3 ❅ f(100) ❅ Sing(1) ❅`,
  `Sing(5 * f(x, y, 2 * y) ❅ ) ❅`,
  `Get~This~Right(Kristoff ❅ ) { Sing(1) ❅ }`,
  `Get~This~Right(Kristoff ❅) { Sing(1)❅ } Into~The~Unknown { Sing(2)❅ }`,
  `Get~This~Right(Kristoff ❅) { Sing(1)❅ } The~Next~Right~Thing(Hans ❅) { Sing(2)❅ }`,
  `Lost~In~The~Woods(Hans ❅) {}`,
];

const badPrograms = [
  `Anna Elsa`,
  `Olaf x = 8`,
  `let y = "Olaf"`,
  `Let~It~Go (Anna i = 0; i < 10; i++) {}`,
  `Let~It~Go (Anna i += 1 ❅ i < 10 ❅ i++) {}`,
  `// This is a comment ( ͡° ͜ʖ ͡°)`,
  `Meltable love = Kristoff ❅`,
  `Olaf z = "I like telling stories!"❅`,
  `Anna string = “Somethings never change”❅`,
  `Olaf Elsa`,
  `Unmeltable Trolls[[]] snowmen = []`,
  `~*This should be a failed comment`,
  `This should also be a failed comment*~`,
  `Elsa = 3 ❅`,
  `Unmeltable Anna x += 2 ❅`,
  `Meltable Love bool -= Kristoff ❅`,
  `Meltable Anna = “I love chocolate” ❅`,
  `Even~Odd(Anna 5) ❅`,
  `Trolls annaLoveHistory = ["Hans loved Anna." : Hans ❅ , "Kristoff loves Anna." : Kristoff ❅] ❅`,
  `Into~The~Unknown() {} Get~This~Right() {} The~Next~Right~Things() {}`,
  `a-- c++ abc = 9 * 3 a = 1`,
  `Herd[] Even~Odd(Herd[] Boop) {Arendelle Boop ❅}`,
  `Closed~Door`,
  `x ++= 1 ❅`,
  `Ice Samantha (Trolls[[]] TrollyBoi) {}`,
  `Lost~In~The~Woods(Hans) {}`,
  `Get~This~Right(Kristoff) { Sing(1)❅ } Into~The~Unknown { Sing(2)❅ }`,
  `Get~This~Right(Kristoff) { Sing(1)❅ } The~Next~Right~Thing(Hans ❅) { Sing(2)❅ }`,
];

describe('The Syntax Checker', () => {
  for (const program of goodPrograms) {
    it(`Successfully recognizes ${program}`, () => {
      assert.ok(syntaxIsOkay(program));
    });
  }
  for (const program of badPrograms) {
    it(`Successfully rejects ${program}`, () => {
      assert.ok(!syntaxIsOkay(program));
    });
  }
});

describe('The Parser', () => {
  for (const program of goodPrograms) {
    it(`Successfully recognizes ${program}`, () => {
      assert.ok(parse(program));
    });
  }
  for (const program of badPrograms) {
    it(`Successfully rejects ${program}`, () => {
      assert.throws(() => parse(program));
    });
  }
});
