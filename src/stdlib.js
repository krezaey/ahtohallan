import { Type, Variable, Function} from "./ast.js"

function makeConstant(name, type, value) {
    return Object.assign(new Variable(name, true), { type, value })
}

function makeFunction(name, type) {
    return Object.assign(new Function(name), { type })
}

export const types = {
    Anna: Type.ANNA,
    Elsa: Type.ELSA,
    Love: Type.LOVE,
    Olaf: Type.OLAF,
    Samantha: Type.SAMANTHA,
}

export const constants = {
    π: makeConstant("π", Type.ELSA, Math.PI),
}

export const functions = {
    Sing: makeFunction("Sing", Type.SAMANTHA),
}