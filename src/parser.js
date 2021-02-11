import fs from "fs"
import ohm from "ohm-js"

const grammar = ohm.grammar(fs.readFileSync("src/ahtohallan.ohm"));
// const grammar = ohm.grammar(`
// Ahtohallan { 
//     Program = ( Expression | Declaration) *
//     Declaration = Function | Class | Variable
//     Variable = mutability type identifier "=" Expression 
//     Expression = RegularExpression | ControlFlowStatements
//     RegularExpression = (ParenthesisExpression | PlainExpression) "❅"
//     Function =  functionWord type identifier "(" Parameters? ")" "{" Body? "}" 
//     Body = (Expression)* 
//     Class = classWord identifier "{" (Constructor | Method | "Field" )* "}" 
//     Constructor = constructorWord "(" Parameters? ")" "{" ClassBody "}"
//     Method = methodWord type identifier "(" Parameters? ")" "{" ClassBody "}"
//     ClassBody = (ClassExpression )*
//     ClassExpression = Expression
//     ControlFlowStatements = IfStatement | WhileLoop | ForLoop | SwitchStatement
//     IfStatement = if "(" Expression ")" "{"Body "}" ( ( elseIf  "(" Expression ")" "{"Body "}" )*)? ( else "{" Body "}" )?
//     WhileLoop = while "(" Expression ")" "{" Body "}"
//     ForLoop = for "("Variable RelationalOperator "❅" Incrementer ")" "{" Body "}"
//     SwitchStatement = switch "(" Expression ")" "{" (case "(" typeValue ")" ":" Body break "❅" )+ (default ":" Body break "❅")?
//     Incrementer = IncrementalOperator | IncrementalAssignmentOperator
//     NewInstance = "Open~Door" identifier "(" Arguments? ")"
//     ObjectTypeValue = Array | Dictionary
//     typeValue = int |  float | string | boolean | noneType | identifier
//     Array = "[" ListOf<typeValue, ",">? "]"
//     Dictionary = "[[" (((string | identifier) ":" typeValue)*)? "]]"
//     controlFlow = if | elseIf | else | while | switch | case | default | for 
//     Expression0= IncrementalOperator | Expression1
//     IncrementalOperator = identifier incop
//     Expression1 = IncrementalAssignmentOperator | Expression2
//     IncrementalAssignmentOperator = Expression1 incAssignop Expression2
//     Expression2 = NonemptyListOf<Expression2, logicalop>? Expression3
//     Expression3 = RelationalOperator | Expression4
//     RelationalOperator = Expression3 relop Expression4
//     Expression4 = (Expression4 addop)?  Expression5
//     Expression5 = (Expression5 mulop)? Expression6
//     Expression6 = (Expression6 exp)? Expression7
//     Expression7 = NewInstance | Expression8
//     Expression8 = negop? Expression9
//     Expression9 = prefixop? typeValue
//     PlainExpression = Expression0
//     ParenthesisExpression =  "(" PlainExpression ")" 
//     identifier = ~reservedWord identifierStart identifierCharacter*
//     Parameters = ListOf< type, identifier >
//     Arguments = ListOf<identifier, ",">
//     reservedWord = type | mutability | constructorWord | classWord | functionWord | methodWord | controlFlow | print | this | new | break | return
//     type = ("Anna" | "Elsa" | "Olaf" | "Love" | "Herd" | "Trolls[[]]" | "Samantha")
//     boolean = ("Kristoff" | "Hans") ~remainingCharacter
//     mutability = ("Unmeltable" | "Meltable") 
//     noneType = "Samantha" ~remainingCharacter
//     constructorWord = "Water" ~remainingCharacter
//     classWord = "Snow" ~remainingCharacter
//     functionWord = "Ice" ~remainingCharacter
//     methodWord = "Crystal" ~remainingCharacter
//     if = "Get~This~Right" ~remainingCharacter
//     elseIf = "The~Next~Right~Thing" ~remainingCharacter
//     else = "Into~The~Unknown" ~remainingCharacter
//     for = "Let~It~Go" ~remainingCharacter
//     while = "Lost~In~The~Woods" ~remainingCharacter
//     switch = "All~Is~Found" ~remainingCharacter
//     case = "Show~Yourself" ~remainingCharacter
//     default = "I~Seek~The~Truth" ~remainingCharacter
//     print = "Sing" ~remainingCharacter
//     this = "Frozen" ~remainingCharacter
//     new = "Open~Door" ~remainingCharacter
//     break = "Closed~Door" ~remainingCharacter
//     return = "Arendelle" ~remainingCharacter
//     remainingCharacter = "_" | alnum
//     identifierStart = letter | "_" | "@" 
//     identifierCharacter = alnum
//     int = digit+
//     float = int* "." int+
//     char = escape | ~"\\" ~"\"" ~"'" ~"\n" any
//     string = "\"" (char | "\'")* "\""
//     addop = "+" | "-"
//     relop = "==" | "!=" | "<" | ">" | "<=" | ">=" 
//     mulop = "*" | "/" | "%"
//     incop = "++" | "--" 
//     incAssignop = "+=" | "-="
//     negop = "-"
//     prefixop = ~negop "!"
//     logicalop = "&&" | "||"
//     exp = "**"
//     comment =  "~*" (~"*~" any)* "*~" 
//     escape = "\\\\" | "\\\"" | "\\'" | "\\n" | "\\t" 
//     space := " " | "\t" | comment 
// }`
// )

export default function parse(source) {
    const match = grammar.match(source)
    return match.succeeded()
}
