import assert from "assert"
import parse from "../src/parser.js"

const goodPrograms = [
    "Unmeltable Anna x = 2 + 3 ❅",
    "Meltable Love bool = Hans ❅",
    "~* This is a comment *~",
    "Let~It~Go (Anna i = 0 ❅ i < 10 ❅ i++) {}",
    "Lost~In~The~Woods (x == Kristoff ❅) {}",
    'Meltable Herd[] me = ["Carrot", "Coal", "Twigs", "Warm Hugs"] ❅',
    'Unmeltable Trolls[[]] annaLoveHistory = ["Hans loved Anna." : Hans, "Kristoff loves Anna." : Kristoff] ❅',
    "Meltable Elsa n = Samantha ❅",
    "Unmeltable Love x = !Hans ❅",
    'Get~This~Right (x < 1 ❅) { Sing("X is less than 1!") ❅ }',
    'Meltable Herd[] Mixed~Casing = [2, "Sven", 1.7, Kristoff]',
    'All~Is~Found(expression ❅) { Show~Yourself(Hans): ~* Code block for case 1 here *~ Closed~Door ❅ Show~Yourself(Kristoff): ~* Code block for case 2 here *~ Closed~Door ❅ I~Seek~The~Truth:  ~* Code block for the default here *~  Closed~Door ❅ }', "~* This is   a comment  *~", "~* This * is also * a comment *~"
]

const badPrograms = [
    "Anna Elsa",
    "Olaf x = 8",
    "let y = 'Olaf'",
    "Let~It~Go (Anna i = 0; i < 10; i++) {}",
    "Let~It~Go (Unmeltable Anna i = 0 ❅ i < 10 ❅ i++) {}",
    "Let~It~Go (Anna i = 0 ❅ i < 10 ❅ i++) {}",
    "// This is a comment ( ͡° ͜ʖ ͡°)",
    "Meltable bool love = Kristoff ❅",
    'Olaf z = "I like telling stories!"❅',
    'Anna string = “Somethings never change”❅',
    "Olaf Elsa",
    "Unmeltable Trolls[[]] snowmen = []",
    "~*This should be a failed comment",
    "This should also be a failed comment*~",
    "Elsa = 3 ❅",
    "Unmeltable Anna x = 2❅",
    "Meltable Love bool = Kristoff❅",
    'Meltable Anna = “I love chocolate” ❅'
]

describe("The parser", () => {
    for (const program of goodPrograms) {
        it(`recognizes ${program}`, () => {
            assert.ok(parse(program))
        })
    }
    for (const program of badPrograms) {
        it(`recognizes ${program}`, () => {
            assert.ok(!parse(program))
        })
    }
})
