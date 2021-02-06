import assert from "assert"
import parse from "../src/parser.js"

const goodPrograms = []
const badPrograms = []

describe("The parser", () => {
    for (const program of goodPrograms) {
        it(`recognizes ${program}`, () => {
            assert.ok(parse(program))
        })
    }
    for (const program of badPrograms) {
        it(`recognizes ${program}`, () => {
            assert.ok(!parse(program))
        })
    }
})