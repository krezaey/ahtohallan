import fs from "fs";
import ohm from "ohm-js";
import * as ast from "./ast.js";

const grammar = ohm.grammar(fs.readFileSync("src/ahtohallan.ohm"));

const astBuilder = grammar.createSemantics().addOperation("tree", {
  Program(statements) {
    return new ast.Program(statements.tree);
  },
  Declaration() {},
  Variable() {},
  Expression() {},
  RegularExpression() {},
  Function() {},
  Body() {},
  Class() {},
  Constructor() {},
  Method() {},
  ClassBody() {},
  ClassExpression() {},
  ControlFlowStatements() {},
  IfStatement() {},
  WhileLoop() {},
  ForLoop() {},
  SwitchStatement() {},
  Incrementer() {},
  NewInstance() {},
  ObjectTypeValue() {},
  Array() {},
  Dictionary() {},
  Expression0() {},
  IncrementalOperator() {},
  Expression1() {},
  IncrementalAssignmentOperator() {},
  Expression2() {},
  Expression3() {},
  RelationalOperator() {},
  Expression4() {},
  Expression5() {},
  Expression6() {},
  Expression7() {},
  Expression8() {},
  Expression9() {},
  PlainExpression() {},
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
