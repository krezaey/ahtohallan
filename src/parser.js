import fs from "fs";
import ohm from "ohm-js";
import * as ast from "./ast.js";

const grammar = ohm.grammar(fs.readFileSync("src/ahtohallan.ohm"));

// const astBuilder = grammar.createSemantics().addOperation("tree", {
//   Program(statements) {
//     return new ast.Program(statements.ast());
//   },
//   // Declaration() { },
//   Variable(mutability, type, name, _eq, expression) {
//     return new ast.Variable(mutability, type, name, expression.ast());
//   },
//   Expression(statement, _terminate) {
//     return statement.ast()
//   },
//   RegularExpression(statement, _terminate) {
//     return statement.ast()
//   },
//   Function(_Ice, type, name, _left, parameters, _right, body) {
//     return new ast.Function(type, name, parameters, body)
//   },
//   Body(_left, statements, _right) {
//     return statements.ast()
//   },
//   Class(_Snow, name, _left, body, _right) {
//     return new ast.Class(name, body)
//   },
//   Constructor(_Water, name, _left, parameters, _right, body) {
//     return new ast.Constructor(name, body)
//   },
//   Method(_Crystal, type, name, _left, parameters, _right, body) {
//     return new ast.Method(type, name, parameters, body)
//   },
//   ClassBody() {

//   },
//   ClassExpression(statement, _terminate) {
//     return statement.ast()
//   },
//   ControlFlowStatements() { },
//   IfStatement() { },
//   WhileLoop() { },
//   ForLoop() { },
//   SwitchStatement() { },
//   Incrementer() { },
//   NewInstance() { },
//   ObjectTypeValue() { },
//   typeValue() { },
//   Array() { },
//   Dictionary() { },
//   controlFlow() { },
//   Expression0() { },
//   IncrementalOperator() { },
//   Expression1() { },
//   IncrementalAssignmentOperator() { },
//   Expression2() { },
//   Expression3() { },
//   RelationalOperator() { },
//   Expression4() { },
//   Expression5() { },
//   Expression6() { },
//   Expression7() { },
//   Expression8() { },
//   Expression9() { },
//   PlainExpression() { },
//   ParenthesisExpression() { },
//   identifier() { },
//   Parameters() { },
//   Arguments() { },
//   reservedWord() { },
//   type() { },
//   boolean() { },
//   mutability() { },
//   noneType() { },
//   constructorWord() { },
//   classWord() { },
//   functionWord() { },
//   methodWord() { },
//   if() { },
//   elseif() { },
//   else() { },
//   for() { },
//   while() { },
//   switch() { },
//   case() { },
//   default() { },
//   print() { },
//   this() { },
//   new() { },
//   break() { },
//   return() { },
//   remainingCharacter() { },
//   identifierStart() { },
//   identifierCharacter() { },
//   int() { },
//   float() { },
//   char() { },
//   string() { },
//   addop() { },
//   relop() { },
//   mulop() { },
//   incop() { },
//   incAssignop() { },
//   negop() { },
//   prefixop() { },
//   logicalop() { },
//   exp() { },
//   comment() { },
//   escape() { },
//   space() { },
//   defaultFunction() { },
//   Call() { },
// });

export function syntaxIsOkay(source) {
  const match = grammar.match(source);
  return match.succeeded();
}

// export default function parse(source) {
//   const match = grammar.match(source);
//   if (!match.succeeded()) {
//     throw new Error(match.message);
//   }
//   return astBuilder(match).tree();
// }
