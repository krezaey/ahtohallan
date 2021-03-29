import { Type, FunctionType, Variable, Function, ArrayType } from "./ast.js"

function makeConstant(name, type, value) {
    return Object.assign(new Variable(name, true), { type, value })
}

function makeFunction(name, type) {
    return Object.assign(new Function(name), { type })
}

export const types = {
    int: Type.INT,
    float: Type.FLOAT,
    boolean: Type.BOOLEAN,
    string: Type.STRING,
    void: Type.VOID,
}

export const constants = {
    π: makeConstant("π", Type.FLOAT, Math.PI),
}

export const functions = {
    print: makeFunction("Sing", new FunctionType([Type.ANY], Type.VOID)),
}