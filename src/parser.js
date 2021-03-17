import fs from "fs";
import ohm from "ohm-js";
import * as ast from "./ast.js";

const grammar = ohm.grammar(fs.readFileSync("src/ahtohallan.ohm"));

const astBuilder = grammar.createSemantics().addOperation("tree", {
  Program(statements) {
    return new ast.Program(statements);
  },
  Variable(mutability, type, name, _eq, init) {
    return new ast.Variable(mutability, type, name, init.ast());
  },
  Function(_functionWord, returnType, name, _left, parameters, _right, body) {
    return new ast.Function(returnType, name, parameters, body);
  },
  Body(_left, statements, _right) {
    return statements.ast();
  },
  Class(_classWord, name, _left, body, _right) {
    return new ast.Class(name, body);
  },
  Constructor(_constructorWord, _left, parameters, _right, body) {
    return new ast.Constructor(parameters, body);
  },
  Method(_methodWord, returnType, name, _left, parameters, _right, body) {
    return new ast.Method(returnType, name, parameters, body);
  },
  Field(field) {
    return new ast.Field(field);
  },
  // Inspiration found in https://github.com/breelynbetts/HYPER for if statement
  IfStatement(
    _if,
    _left1, 
    condition,
    _right1,
    ifBody,
    _elif,
    _left2,
    additionalConditions,
    _right2,
    elifBodies,
    _else,
    elseBody
  ) {
    const conditions = [condition.ast(), ...additionalConditions.ast()];
    const bodies = [ifBody.ast(), ...elifBodies.ast()];
    const end = elseBody.length === 0 ? null : elseBody.ast();
    return new IfStatement(conditions, bodies.flat(), end);
  },
  WhileLoop(_while, _left, expression, _right, body) {
    return new ast.WhileLoop(expression, body);
  },
  ForLoop(_for, _left, start, limit, _terminal, increment, _right, body) {
    return new ast.ForLoop(start, limit, increment, body);
  },
  SwitchStatement(
    _switch,
    _left1,
    expression,
    _right1,
    _left2,
    _case,
    _left3,
    cases,
    _right3,
    _colon1,
    caseBodies,
    _break1,
    _terminal1,
    _default,
    _colon2,
    defaultBody,
    _break2,
    _terminal2,
    _right2
  ) {
    const Default = defaultBody.length === 0 ? null : defaultBody;
    return new ast.SwitchStatement(expression, cases, caseBodies, Default);
  },
  NewInstance(_new, name, _left, args, _right) {
    return new ast.NewInstance(name, args);
  },
  Array(_left, type, _right) {
    return new ast.Array(type);
  },
  Dictionary(_openDict, entries, _closeDict) {
    return new ast.Dictionary(entries);
  },
  Incrementer(operand, op) {
    return new ast.Increment(operand, op);
  },
  IncrementalAssignment(variable, operand, op) {
    return new ast.IncrementalAssignment(variable, operand, op);
  },
  Relation(left, op, right) {
    return new ast.Relation(left, op, right);
  },
  Expression2_logicalop(left, op, right) {
    return new ast.Expression2_logicalop(left, op, right);
  },
  Expression4_addop(left, op, right) {
    return new ast.Expression4_addop(left, op, right);
  },
  Expression5_mulop(left, op, right) {
    return new ast.Expression5_mulop(left, op, right);
  },
  Expression6_exp(left, op, right) {
    return new ast.Expression6_exp(left, op, right);
  },
  Expression8_negop(left, op) {
    return new ast.Expression8_negop(left, op);
  },
  Expression9_prefixop(left, op) {
    return new ast.Expression9_prefixop(left, op);
  },
  identifier(_identifierStart, _identifierCharacter) {
    return new ast.Identifier(this.sourceString);
  },
  GetProperty(source, _dot, property) {
    return new ast.GetProperty(source, property);
  },
  ParenthesisExpression(_left, expression, _right) {
    return new expression.ast();
  },
  DictionaryEntry(key, _colon, value) {
    return new ast.DictionaryEntry(key, value);
  },
  DictionaryEntries(entries) {
    return new ast.DictionaryEntries(entries);
  },
  Parameter(types, names) {
    return new ast.Parameter(types.length === 0? null: types, names.length === 0? null: names);
  },
  Parameters(parameters) {
    return new ast.Parameters(parameters.length === 0? null: parameters);
  },
  Arguments(names) {
    return new ast.Arguments(names.length === 0 ? null:names);
  },
  _terminal() {
    return this.sourceString;
  },
  Call(callee, _left, args, _right, _terminal) {
    return new ast.Call(callee, args.length === 0 ? null:args);
  },
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
