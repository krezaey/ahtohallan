import fs from "fs";
import ohm from "ohm-js";
import * as ast from "./ast.js";

const grammar = ohm.grammar(fs.readFileSync("src/ahtohallan.ohm"));

const astBuilder = grammar.createSemantics().addOperation("tree", {
  Program(statements) {
    return new ast.Program(statements.ast());
  },
  Variable(mutability, type, name, _eq, init) {
    return new ast.Variable(mutability, type, name, init.ast());
  },
  Function(_functionWord, returnType, name, _left, parameters, _right, body) {
    return new ast.Function(returnType, name, parameters, body)
  },
  Body(_left, statements, _right) {
    return statements.ast()
  },
  Class(_classWord, name, _left, body, _right) {
    return new ast.Class(name, body)
  },
  Constructor(_constructorWord, name, _left, parameters, _right, body) {
    return new ast.Constructor(name, body)
  },
  Method(_methodWord, returnType, name, _left, parameters, _right, body) {
    return new ast.Method(returnType, name, parameters, body)
  },
  Field(field) {
    return new ast.Field(field)
  },
  // Susssssss All these if statements are iffy as best
  IfStatement_long(_if, _left, expression, _right, body, _elseIf, _left, expression1, _right, _else, expression1, _right, alternate) {
    return new ast.IfStatement()
  },
  IfStatement_med(_if, _left, expression, _right, body,  _else, expression1, _right, alternate) {
    return new ast.IfStatement()
  },
  IfStatement_short(_if, _left, expression, _right, body) {
    return new ast.IfStatement()
  },
  WhileLoop(_while, _left, expression, _right, body) {
    return new ast.WhileLoop(expression, body)
  },
  ForLoop(_for, _left, start, limit, increment, _right, body) {
    return new ast.ForLoop(start, limit, increment, body)
  },
  // Ask Toal for help!!!!
  SwitchStatement(_switch, _left, expression, _right, _left, ) {

  },
  NewInstance(_new, name, _left, args, _right) {
    return new ast.NewInstance(name, args)
  },
  Array(_left, type, _right) {
    return new ast.Array(type)
  },
  Dictionary(_left, _left, keyType, valueType, _right, _right) {
    return new ast.Dictionary(keyType, valueType);
  },
  IncrementalOperator(operand, op) {
    return new ast.IncrementalOperator(operand, op)
  },
  IncrementalAssignment(variable, operand, op) {
    return new ast.IncrementalAssignment(variable, operand, op)
  },
  Relation(left, op, right) { 
    return new ast.Relation(left, op, right)
  },
  GetProperty(source, _dot, property) {
    return new ast.GetProperty(source, property)
  },
  ParenthesisExpression(_left, expression, _right) { 
    return expression.ast();
  },
  identifier() { },
  Parameters() { },
  Arguments() { },
  break() { },
  return() { },
  defaultFunction() { },
  Call() { }
});

export function syntaxIsOkay(source) {
  const match = grammar.match(source);
  return match.succeeded();
}

export default function parse(source) {
  const match = grammar.match(source);
  if (!match.succeeded()) {
    throw new Error(match.message);
  }
  return astBuilder(match).tree();
}
