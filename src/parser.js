import fs from 'fs';
import ohm from 'ohm-js';
import * as ast from './ast.js';

const grammar = ohm.grammar(fs.readFileSync('src/ahtohallan.ohm'));

const astBuilder = grammar.createSemantics().addOperation('tree', {
  Program(statements) {
    return new ast.Program(statements.tree());
  },
  Variable(mutability, type, name, _eq, init) {
    return new ast.Variable(mutability.sourceString, type.tree(), name.sourceString, init.tree());
  },
  Expression(e, _terminal) {
    return e.tree();
  },
  ReturnStatement(_return, output) {
    return new ast.ReturnStatement(output.tree());
  },
  PlainAssignment(name, _equals, expression) {
    return new ast.PlainAssignment(name.tree(), expression.tree());
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
    const end = elseBody.tree();
    return new ast.IfStatement(conditions, bodies.flat(), end);
  },
  WhileLoop(_while, _left, expression, _right, body) {
    return new ast.WhileLoop(expression.tree(), body.tree());
  },
  AccessDot(_dot, accessValue) {
    return new ast.Access(accessValue.tree());
  },
  AccessInt(_bracketOpen, accessValue, _bracketClosed) {
    return new ast.Access(accessValue.tree());
  },
  AccessKeyValue(_bracketOpen, accessValue, _bracketClosed) {
    return new ast.Access(accessValue.tree());
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
    _default,
    _colon2,
    defaultBody,
    _right2
  ) {
    return new ast.SwitchStatement(
      expression.tree(),
      cases.tree(),
      caseBodies.tree(),
      defaultBody.tree()
    );
  },
  BreakStatement(_break, _terminal) {
    return this.sourceString;
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
  Incrementer(operand, op, _terminal) {
    return new ast.Incrementer(operand.tree(), op.sourceString);
  },
  IncrementalAssignment(variable, op, operand) {
    return new ast.IncrementalAssignment(variable.tree(), op.sourceString, operand.tree());
  },
  Relation(left, op, right) {
    return new ast.BinaryExpression(left.tree(), op, right.tree());
  },
  Expression2_logicalop(left, op, right) {
    return new ast.BinaryExpression(left.tree(), op, right.tree());
  },
  Expression4_addop(left, op, right) {
    return new ast.BinaryExpression(left.tree(), op, right.tree());
  },
  Expression5_mulop(left, op, right) {
    return new ast.BinaryExpression(left.tree(), op, right.tree());
  },
  Expression6_exp(left, op, right) {
    return new ast.BinaryExpression(left.tree(), op, right.tree());
  },
  Expression8_negop(op, right) {
    return new ast.UnaryExpression(op.tree(), right.tree());
  },
  Expression9_prefixop(op, right) {
    return new ast.UnaryExpression(op.tree(), right.tree());
  },
  identifier(_identifierStart, _identifierCharacter) {
    return new ast.Identifier(this.sourceString);
  },
  GetProperty(source, property) {
    return new ast.GetProperty(source.tree(), property.tree());
  },
  ParenthesisExpression(_left, expression, _right) {
    return expression.tree();
  },
  DictionaryEntry(key, _colon, value) {
    return new ast.DictionaryEntry(key.tree(), value.tree());
  },
  DictionaryEntries(entries) {
    return new ast.DictionaryEntries(entries.asIteration().tree());
  },
  Parameter(type, name) {
    return new ast.Parameter(type.tree(), name.sourceString);
  },
  Parameters(parameters) {
    return new ast.Parameters(parameters.asIteration().tree());
  },
  Arguments(names) {
    return new ast.Arguments(names.asIteration().tree());
  },
  string(_left, contents, _right) {
    return contents.sourceString;
  },
  float(_whole, _dot, _fractional) {
    return this.sourceString;
  },
  _terminal() {
    return this.sourceString;
  },
  Call(callee, _left, args, _right, _terminal) {
    return new ast.Call(callee.tree(), args.asIteration().tree());
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
