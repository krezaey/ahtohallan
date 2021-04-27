import assert from "assert/strict"
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
    source: ``,
    expected: dedent``,
  },
  {
    name: "if program",
    source: `
    `,
    expected: dedent``,
  },
  {
    name: "while program",
    source: ``,
    expected: dedent``,
  },
  {
    name: "function program",
    source: `
    `,
    expected: dedent`
    `,
  },
  {
    name: "arrays program",
    source: ``,
    expected: dedent`
    `,
  },
  {
    name: "class program",
    source: ``,
    expected: dedent``,
  },
  {
    name: "switch statement program",
    source: ``,
    expected: dedent``,
  },
  {
    name: "for loops program",
    source: ``,
    expected: dedent``,
  },
  {
    name: "standard library",
    source: ``,
    expected: dedent``,
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