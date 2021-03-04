export class Program {
  constructor(instructions) {
    this.instructions = instructions;
  }
}

export class Declaration {
  constructor(declaration) {
    this.declaration = declaration;
  }
}

export class Variable {
  constructor(mutability, type, name, expression) {
    Object.assign(this, { mutability, type, name, expression });
  }
}

export class Expression {
  constructor(expression) {
    this.expression = expression;
  }
}

export class RegularExpression {
  constructor(regularExpression) {
    this.regularExpression = regularExpression;
  }
}

export class Function {
  constructor(returnType, name, parameters, body) {
    Object.assign(this, { returnType, name, parameters, body });
  }
}

export class Body {
  constructor(expressions) {
    this.expression = expressions;
  }
}

export class Class {
  constructor(name, body) {
    Object.assign(this, { name, body });
  }
}

export class Constructor {
  constructor(parameters, body) {
    Object.assign(this, { parameters, body });
  }
}

export class Method {
  constructor(returnType, name, parameters, body) {
    Object.assign(this, { returnType, name, parameters, body });
  }
}

export class ClassBody {
  constructor(expressions) {
    this.expressions = expressions;
  }
}

export class ClassExpression {
  constructor(expression) {
    this.expression = expression;
  }
}

export class ControlFlowStatements {
  constructor(instruction) {
    this.instruction = instruction;
  }
}
// She is susssssss!!! sus
export class IfStatement {
  constructor(expressions, bodies) {
    Object.assign(this, { expressions, bodies });
  }
}

export class WhileLoop {
  constructor(expression, body) {
    Object.assign(this, { expression, body });
  }
}

export class ForLoop {
  constructor() {}
}

export class SwitchStatement {
  constructor() {}
}

export class Incrementer {
  constructor() {}
}

export class NewInstance {
  constructor() {}
}

export class ObjectTypeValue {
  constructor() {}
}

export class Array {
  constructor() {}
}

export class Dictionary {
  constructor() {}
}

export class Expression0 {
  constructor() {}
}

export class IncrementalOperator {
  constructor() {}
}

export class Expression1 {
  constructor() {}
}

export class IncrementalAssignmentOperator {
  constructor() {}
}

export class Expression2 {
  constructor() {}
}

export class Expression3 {
  constructor() {}
}

export class RelationalOperator {
  constructor() {}
}

export class Expression4 {
  constructor() {}
}

export class Expression5 {
  constructor() {}
}

export class Expression6 {
  constructor() {}
}

export class Expression7 {
  constructor() {}
}

export class Expression8 {
  constructor() {}
}

export class Expression9 {
  constructor() {}
}

export class PlainExpression {
  constructor() {}
}
