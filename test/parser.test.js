import assert from "assert";
import parse, { syntaxIsOkay } from "../src/parser.js"

const goodPrograms = [
  `Unmeltable Anna x = -2 + 3 ❅`,
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
  `Get~This~Right (x < 1 ❅) { Sing("X is less than 1!") ❅ } Into~The~Unknown { Sing("X is not 1 or 3 or a number!") ❅ }`
];

const badPrograms = [
  `Anna Elsa`,
  `Olaf x = 8`,
  `let y = "Olaf"`,
  `Let~It~Go (Anna i = 0; i < 10; i++) {}`,
  `Let~It~Go (Anna i += 1 ❅ i < 10 ❅ i++) {}`,
  `// This is a comment ( ͡° ͜ʖ ͡°)`,
  `Meltable bool love = Kristoff ❅`,
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
];

describe("The Syntax Checker", () => {
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

describe("The Parser", () => {
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
