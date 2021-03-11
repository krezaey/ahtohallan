export class Program {
  constructor(instructions) {
    this.instructions = instructions;
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

export class Function {
  constructor(returnType, name, parameters, body) {
    Object.assign(this, { returnType, name, parameters, body });
  }
}

export class Body {
  constructor(statements) {
    this.statements = statements;
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

export class IfStatement {
  constructor(expression, body, alternate) {
    Object.assign(this, { expression, body, alternate });
  }
}

export class WhileLoop {
  constructor(expression, body) {
    Object.assign(this, { expression, body });
  }
}

export class ForLoop {
  constructor(iterator, range, body) {
    Object.assign(this, { iterator, range, body })
  }
}

export class SwitchStatement {
  constructor(expression, cases, body, defaultCase) {
    Object.assign(this, { expression, cases, body, defaultCase })
  }
}

export class NewInstance {
  constructor(identifier, args) {
    Object.assign(this, { identifier, args })
  }
}

export class Array {
  constructor(type) {
    this.type = type
  }
}

// kinda suSSSSSSSS my guy
export class Dictionary {
  constructor(name, keyType, valueType) {
    Object.assign(this, { name, keyType, valueType })
  }
}

export class IncrementalOperator {
  constructor(op, operand) {
    Object.assign(this, { op, operand })
  }
}

export class IncrementalAssignment {
  constructor(variable, op, operand) {
    Object.assign(this, { variable, op, operand })
  }
}

export class Relation {
  constructor(left, operand, right) {
    Object.assign(this, { left, operand, right })
  }
}

export class GetProperty {
  constructor(source, property) {
    Object.assign(this, {source, property})
  }
}

export class Call {
  constructor(name, args) {
    Object.assign(this, { name, args })
  }
}
