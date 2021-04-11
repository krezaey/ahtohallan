export class Program {
  constructor(instructions) {
    this.instructions = instructions
  }
}

export class Variable {
  constructor(mutability, type, name, expression) {
    Object.assign(this, { mutability, type, name, expression })
  }
}

export class ReturnStatement {
  constructor(expression) {
    this.expression = expression
  }
}

export class ShortReturnStatement {
  // Empty
}

// export class Expression {
//   constructor(expression) {
//     this.expression = expression
//   }
// }

export class Function {
  constructor(returnType, name, parameters, body) {
    Object.assign(this, { returnType, name, parameters, body })
  }
}

export class Snow {
  constructor(name, body) {
    Object.assign(this, { name, body })
  }
}

export class Constructor {
  constructor(parameters, body) {
    Object.assign(this, { parameters, body })
  }
}

export class Method {
  constructor(returnType, name, parameters, body) {
    Object.assign(this, { returnType, name, parameters, body })
  }
}

export class Field {
  constructor(field) {
    this.field = field
  }
}

export class IfStatement {
  constructor(condition, body, alternate) {
    Object.assign(this, { condition, body, alternate })
  }
}

export class WhileLoop {
  constructor(expression, body) {
    Object.assign(this, { expression, body })
  }
}

export class Access {
  constructor(accessValue) {
    this.accessValue = accessValue
  }
}

export class ForLoop {
  constructor(start, limit, increment, body) {
    Object.assign(this, { start, limit, increment, body })
  }
}

export class SwitchStatement {
  constructor(expression, cases, body, defaultCase) {
    Object.assign(this, { expression, cases, body, defaultCase })
  }
}

export class BreakStatement {
  // Nothing here, intentionally
}

export class NewInstance {
  constructor(identifier, args) {
    Object.assign(this, { identifier, args })
  }
}

export class ArrayExpression {
  constructor(values) {
    this.values = values
  }
}

export class Dictionary {
  constructor(entries) {
    this.entries = entries
  }
}

export class DictionaryEntry {
  constructor(key, value) {
    Object.assign(this, { key, value })
  }
}

export class DictionaryEntries {
  constructor(entries) {
    this.entries = entries
  }
}

export class Parameter {
  constructor(type, name) {
    Object.assign(this, { type, name })
  }
}

export class Parameters {
  constructor(parameter) {
    this.parameter = parameter
  }
}

export class Arguments {
  constructor(names) {
    this.names = names
  }
}

export class Argument {
  constructor(arg) {
    this.arg = arg
  }
}

export class Incrementer {
  constructor(operand, op) {
    Object.assign(this, { operand, op })
  }
}

export class PlainAssignment {
  constructor(variable, expression) {
    Object.assign(this, { variable, expression })
  }
}

export class IncrementalAssignment {
  constructor(variable, op, operand) {
    Object.assign(this, { variable, op, operand })
  }
}

// export class Relation {
//   constructor(left, op, right) {
//     Object.assign(this, { left, op, right })
//   }
// }

export class BinaryExpression {
  constructor(left, op, right) {
    Object.assign(this, { left, op, right })
  }
}

// export class Expression2_logicalop {
//   constructor(left, op, right) {
//     Object.assign(this, { left, op, right })
//   }
// }

// export class Expression4_addop {
//   constructor(left, op, right) {
//     Object.assign(this, { left, op, right })
//   }
// }

// export class Expression5_mulop {
//   constructor(left, op, right) {
//     Object.assign(this, { left, op, right })
//   }
// }

// export class Expression6_exp {
//   constructor(left, op, right) {
//     Object.assign(this, { left, op, right })
//   }
// }

export class UnaryExpression {
  constructor(op, right) {
    Object.assign(this, { op, right })
  }
}
// export class Expression8_negop {
//   constructor(op, right) {
//     Object.assign(this, { op, right })
//   }
// }

// export class Expression9_prefixop {
//   constructor(op, right) {
//     Object.assign(this, { op, right })
//   }
// }

export class Identifier {
  constructor(name) {
    this.name = name
  }
}

export class GetProperty {
  constructor(source, property) {
    Object.assign(this, { source, property })
  }
}

export class Call {
  constructor(name, args) {
    Object.assign(this, { name, args })
  }
}

export class Type {
  constructor(name) {
    this.name = name
  }

  static LOVE = new Type('Love')
  static ANNA = new Type('Anna')
  static ELSA = new Type('Elsa')
  static OLAF = new Type('Olaf')
  static SAMANTHA = new Type('Samantha')
  static HERD = new Type('Herd[]')
  static TROLLS = new Type('Trolls[[]]')
  static TYPE = new Type('Type')
  static ANY = new Type('Any')

  // isEquivalentTo(target) {
  //   return this === target
  // }

  // isAssignableTo(target) {
  //   return this.isEquivalentTo(target)
  // }
}

// export class ArrayType extends Type {
//   constructor(baseType) {
//     super(`[${baseType.name}]`)
//   }
// }

export class DictionaryType extends Type {
  constructor(keyType, valueType) {
    super(`(${keyType.map(t => t.name).join(',')}):${valueType.name}`)
  }
}

export class FunctionType extends Type {
  constructor(parameterTypes, returnType) {
    super(`(${parameterTypes.map(t => t.name).join(',')})->${returnType ? returnType.name: "Samantha"}`)
    Object.assign(this, { parameterTypes, returnType })
  }
}

export class ClassType extends Type {
  constructor(name, body) {
    super(name)
    this.body = body
  }
}

export class Booley {
  constructor(value) {
    Object.assign(this, {value, type : Type.LOVE})
  }
}

export class Integer {
  constructor(value) {
    Object.assign(this, {value, type : Type.ANNA})
  }
}

export class Float {
  constructor(value) {
    Object.assign(this, {value, type : Type.ELSA})
  }
}

export class Phrase {
  constructor(value) {
    Object.assign(this, {value, type : Type.OLAF})
  }
}


// export class VoidType extends Type {
//   constructor(value) {
//     super(null)
//     this.value = value
//   }
// }