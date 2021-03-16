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

export class Field {
	constructor(field) {
		this.field = field;
	}
}

export class IfStatement {
	constructor(condition, body, alternate) {
		Object.assign(this, { condition, body, alternate });
	}
}

export class WhileLoop {
	constructor(expression, body) {
		Object.assign(this, { expression, body });
	}
}

export class ForLoop {
	constructor(start, limit, increment, body) {
		Object.assign(this, { start, limit, increment, body });
	}
}

export class SwitchStatement {
	constructor(expression, cases, body, defaultCase) {
		Object.assign(this, { expression, cases, body, defaultCase });
	}
}

export class NewInstance {
	constructor(identifier, args) {
		Object.assign(this, { identifier, args });
	}
}

// export class Array {
// 	constructor(value) {
// 		this.value = value;
// 	}
// }

// export class Dictionary {
// 	constructor(name, key, value) {
// 		Object.assign(this, { name, key, value });
// 	}
// }

// export class DictionaryEntry {
// 	constructor(key, value) {
// 		Object.assign(this, { key, value });
// 	}
// }

// export class DictionaryEntries {
// 	constructor(entries) {
// 		this.entries = entries;
// 	}
// }

// export class Parameters {
// 	constructor(types, names) {
// 		Object.assign(this, { types, names });
// 	}
// }

// export class Arguments {
// 	constructor(names) {
// 		this.names = names;
// 	}
// }

// export class DefaultFunction {
// 	constructor(call) {
// 		this.call = call;
// 	}
// }

// export class Incrementer {
// 	constructor(operand, op) {
// 		Object.assign(this, { operand, op });
// 	}
// }

// export class IncrementalAssignment {
// 	constructor(variable, operand, op) {
// 		Object.assign(this, { variable, operand, op });
// 	}
// }

// export class Relation {
// 	constructor(left, op, right) {
// 		Object.assign(this, { left, op, right });
// 	}
// }

// export class Expression2_logicalop {
// 	constructor(left, op, right) {
// 		Object.assign(this, { left, op, right });
// 	}
// }

// export class Expression4_addop {
// 	constructor(left, op, right) {
// 		Object.assign(this, { left, op, right });
// 	}
// }

// export class Expression5_mulop {
// 	constructor(left, op, right) {
// 		Object.assign(this, { left, op, right });
// 	}
// }

// export class Expression6_exp {
// 	constructor(left, op, right) {
// 		Object.assign(this, { left, op, right });
// 	}
// }

// export class Expression8_negop {
// 	constructor(left, op) {
// 		Object.assign(this, { left, op });
// 	}
// }

// export class Expression9_prefixop {
// 	constructor(left, op) {
// 		Object.assign(this, { left, op });
// 	}
// }

// export class Identifier {
// 	constructor(name) {
// 		this.name = name;
// 	}
// }

// export class GetProperty {
// 	constructor(source, property) {
// 		Object.assign(this, { source, property });
// 	}
// }

// export class Call {
// 	constructor(name, args) {
// 		Object.assign(this, { name, args });
// 	}
// }
