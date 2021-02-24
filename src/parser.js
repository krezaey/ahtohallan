import fs from "fs"
import ohm from "ohm-js"
import * as ast from "./ast.js"

const grammar = ohm.grammar(fs.readFileSync("src/ahtohallan.ohm"));

const astBuilder = grammar.createSemantics().addOperation("tree", {
    Program(statements) {
        return new ast.Program(statements.tree)
    }
})

export function syntaxIsOkay(source) {
    const match = grammar.match(source)
    return match.succeeded()
}

export default function parse(source) {
    const match = grammar.match(source)
    if (!match.succeeded()) {
        throw new Error(match.message)
    }
    return astBuilder(match).tree()
}