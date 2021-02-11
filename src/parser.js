import fs from "fs"
import ohm from "ohm-js"

const grammar = ohm.grammar(fs.readFileSync("src/ahtohallan.ohm"));

export default function parse(source) {
    const match = grammar.match(source)
    return match.succeeded()
}
