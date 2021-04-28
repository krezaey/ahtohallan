import assert from "assert"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"
import optimize from "../src/optimizer.js"
import generate from "../src/generator.js"

function dedent(s) {
  return `${s}`.replace(/(?<=\n)\s+/g, "").trim()
}

const fixtures = [
  {
    name: "small program",
    source: `
      Meltable Anna num = 2 ❅
      Ice Olaf Even~Odd(Anna num) {
        Get~This~Right (num % 2 == 0 ❅) {
          Arendelle "This number is even." ❅
        }
        Into~The~Unknown {
          Arendelle "This number is odd." ❅
        }
      }
    `,
    expected: dedent`
      let num = 2;
      function Even~Odd(num) {
        if (num % 2 === 0) {
          return "This number is even.";
        }
        else {
          return "This number is odd.";
        }
      }
    `,
  },
  {
    name: "if program",
    source: `
      Meltable Anna x = 0 ❅ 
      Get~This~Right (x < 1 ❅) {
        Sing("X is less than 1!") ❅
      }
      The~Next~Right~Thing (x == 1 ❅) {
        Sing("X is less than 1!") ❅
      }
      Into~The~Unknown {
        Sing("X is neither less than 1 or equal to 1, meaning it is greater!") ❅
      }
    `,
    expected: dedent`
      let x = 0; 
      if (x < 1) {
        console.log("X is less than 1!");
      }
      else if (x === 1) {
        console.log("X is less than 1!");
      }
      else {
        console.log("X is neither less than 1 or equal to 1, meaning it is greater!");
      }
    `,
  },
  {
    name: "while program",
    source: `
      Meltable Love x = Hans ❅
      Lost~In~The~Woods(x == Kristoff ❅) {
        Unmeltable Olaf y = "TRUEEE!" ❅
        Sing(y) ❅
      }
    `,
    expected: dedent`
      let x = false; 
      while (x === true) {
        const y = "TRUEEE!"; 
        console.log(y);
      }
    `,
  },
  {
    name: "function program",
    source: `
      Ice Anna Square (Anna Number) {
        Arendelle Number * Number ❅
      }
    `,
    expected: dedent`
      function square (number) {
        return number * number;
      }
    `,
  },
  {
    name: "arrays program",
    source: `
      Meltable Anna population = 8 ❅
      Meltable Herd[] citizens = ["Sage", "Keziah", "Elise", "Ona", "Dr. Toal", "Michael", "Ameya", "Salem"] ❅
      Let~It~Go(Meltable Anna i = 0 ❅ i < population ❅ i++ ❅) {
        Get~This~Right(i % 2 ❅) {
          Sing(citizens[i] + " is a trusted citizen of Arendelle") ❅
        } Into~The~Unknown{
          Sing(citizens[i] + " is on the Arendelle watchlist for suspicious activities") ❅
        }    
      }
    `,
    expected: dedent`
    let population = 8;
    let citizens = ["Sage", "Keziah", "Elise", "Ona", "Dr. Toal", "Michael", "Ameya", "Salem"];
    for (int i = 0; i < population; i++) {
      if (i % 2) {
        console.log(citizens[i] + " is a trusted citizen of Arendelle");
      } else {
        console.log(citizens[i] + " is on the Arendelle watchlist for suspicious activities");
      }  
    }
    `,
  },
  {
    name: "class program",
    source: `
      Snow Point {
        Meltable Love state = Hans ❅
      
        Water (Olaf name, Anna segments, Elsa length) {
          Frozen.name = name ❅
          Frozen.segments = segments ❅
          Frozen.length = length ❅
        }
      
        Crystal Samantha Print~Point~Info() {
          Sing(Frozen.name) ❅
        }
      }
    `,
    expected: dedent`
      class Point {
        let state = false; 

        constructor(name, segments, length) {
          this.name = name; 
          this.segments = segments; 
          this.length = length;
        }

        function Print~Point~Info() {
          console.log(this.name);
        }
      }
    `,
  },
  {
    name: "switch statement program",
    source: `
      Meltable Olaf result = "" ❅
      All~Is~Found(x + y ❅) {
        Show~Yourself(1):
          result = "The sum was one." ❅
          Closed~Door ❅
        Show~Yourself(2):
          result = "The sum was two." ❅
          Closed~Door ❅
        I~Seek~The~Truth:
          result = "The sum was something else not listed." ❅
          Closed~Door ❅
      }
      Arendelle result ❅
      `,
    expected: dedent`
      let result = ""; 
      switch (x + y) {
        case 1:
          result = "The sum was one.";
          break;
        case 2:
          result = "The sum was two.";
          break;
        default:
          result = "The sum was something else not listed.";
          break;
      }
      return result;
    `,
  },
  {
    name: "for loops program",
    source: `
      Ice Samantha Fizz~Buzz() {
        Let~It~Go (Meltable Anna i = 0 ❅ i <= 100 ❅ i++ ❅) {
          Get~This~Right (i % 3 == 0 && i % 5 == 0 ❅) {
            Sing("FizzBuzz") ❅
          }
          The~Next~Right~Thing (i % 3 == 0 ❅) {
            Sing("Fizz") ❅
          }
          The~Next~Right~Thing (i % 5 == 0 ❅) {
            Sing("Buzz") ❅
          }
          Into~The~Unknown {
            Sing(i) ❅
          }
        }
      }
    `,
    expected: dedent`
      function fizzBuzz() {
        for (let i = 1; i <= 100; i++) {
          if (i % 3 === 0 && i % 5 === 0) {
            console.log("FizzBuzz");
          } else if (i % 3 === 0) {
            console.log("Fizz");
          } else if (i % 5 === 0) {
            console.log("Buzz");
          } else {
            console.log(i);
          }
        }
      }
    `,
  },
  {
    name: "standard library",
    source: `
      Sing("Hello, Hello, and Welcome to my Show") ❅
    `,
    expected: dedent`
      console.log("Hello, Hello, and Welcome to my Show");
    `,
  },
]

describe("The Code Generator", () => {
  for (const fixture of fixtures) {
    it(`produces expected js output for the ${fixture.name} program`, () => {
      const actual = generate(optimize(analyze(parse(fixture.source))))
      assert.deepEqual(actual, fixture.expected)
    })
  }
})