import fs from "fs";
import ohm from "ohm-js";
import * as ast from "./ast.js";

const grammar = ohm.grammar(fs.readFileSync("src/ahtohallan.ohm"));

const astBuilder = grammar.createSemantics().addOperation("tree", {
  Program(statements) {
    return new ast.Program(statements.tree());
  },
  Variable(mutability, type, name, _eq, init) {
    return new ast.Variable(mutability.sourceString, type.tree(), name.sourceString, init.tree());
  },
  Expression(e, _snowflake) {
    return e.tree()
  },
  ReturnStatement(_return, output) {
    return new ast.ReturnStatement(output.tree());
  },
  Function(_functionWord, returnType, name, _left, parameters, _right, body) {
    return new ast.Function(returnType.tree(), name.sourceString, parameters.tree(), body.tree());
  },
  Body(_left, statements, _right) {
    return statements.tree();
  },
  Class(_classWord, name, _left, body, _right) {
    return new ast.Class(name, body.tree());
  },
  Constructor(_constructorWord, _left, parameters, _right, body) {
    return new ast.Constructor(parameters.tree(), body.tree());
  },
  Method(_methodWord, returnType, name, _left, parameters, _right, body) {
    return new ast.Method(returnType.tree(), name.sourceString, parameters.tree(), body.tree());
  },
  Field(field) {
    return new ast.Field(field.tree());
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
    const conditions = [condition.tree(), ...additionalConditions.tree()];
    const bodies = [ifBody.tree(), ...elifBodies.tree()];
    const end = elseBody.length === 0 ? null : elseBody.tree();
    return new ast.IfStatement(conditions, bodies.flat(), end);
  },
  WhileLoop(_while, _left, expression, _right, body) {
    return new ast.WhileLoop(expression.tree(), body.tree());
  },
  ForLoop(_for, _left, start, limit, _terminal, increment, _right, body) {
    return new ast.ForLoop(start.tree(), limit.tree(), increment.tree(), body.tree());
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
    return new ast.NewInstance(name.sourceString, args.tree());
  },
  Array(_left, type, _right) {
    return new ast.Array(type.asIteration().tree());
  },
  Dictionary(_openDict, entries, _closeDict) {
    return new ast.Dictionary(entries.tree());
  },
  Incrementer(operand, op) {
    return new ast.Incrementer(operand.tree(), op.sourceString);
  },
  IncrementalAssignment(variable, operand, op) {
    return new ast.IncrementalAssignment(variable, operand.tree(), op.sourceString);
  },
  Relation(left, op, right) {
    return new ast.Relation(left.tree(), op, right.tree());
  },
  Expression2_logicalop(left, op, right) {
    return new ast.Expression2_logicalop(left.tree(), op, right.tree());
  },
  Expression4_addop(left, op, right) {
    return new ast.Expression4_addop(left.tree(), op, right.tree());
  },
  Expression5_mulop(left, op, right) {
    return new ast.Expression5_mulop(left.tree(), op, right.tree());
  },
  Expression6_exp(left, op, right) {
    return new ast.Expression6_exp(left.tree(), op, right.tree());
  },
  Expression8_negop(op, right) {
    return new ast.Expression8_negop(op.tree(), right.tree());
  },
  Expression9_prefixop(op, right) {
    return new ast.Expression9_prefixop(op.tree(), right.tree());
  },
  identifier(_identifierStart, _identifierCharacter) {
    return new ast.Identifier(this.sourceString);
  },
  GetProperty(source, _dot, property) {
    return new ast.GetProperty(source, property);
  },
  ParenthesisExpression(_left, expression, _right) {
    return new expression.tree();
  },
  DictionaryEntry(key, _colon, value) {
    return new ast.DictionaryEntry(key.tree(), value.tree());
  },
  DictionaryEntries(entries) {
    return new ast.DictionaryEntries(entries.asIteration().tree());
  },
  Parameter(types, names) {
    return new ast.Parameter(types.length === 0 ? null : types, names.length === 0 ? null : names);
  },
  Parameters(parameters) {
    return new ast.Parameters(parameters.length === 0 ? null : parameters);
  },
  Arguments(names) {
    return new ast.Arguments(names.length === 0 ? null : names);
  },
  string(_left, contents, _right) {
    return contents.sourceString
  },
  float(_whole, _dot, _fractional) {
    return this.sourceString
  },
  _terminal() {
    return this.sourceString;
  },
  Call(callee, _left, args, _right, _terminal) {
    return new ast.Call(callee.tree(), args.length === 0 ? null : args.tree());
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
