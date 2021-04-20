import ohm from 'ohm-js'

const grammars = {
  canadianPostalCode: `
      code = fsa " " ldu
      fsa = firstLetter digit validLetter
      ldu = digit validLetter digit
      validLetter = "A" | "B" | "C" | "E" | "G" | "H" | "J" | "K" | "L" | "M" | "N" | "P" | "R" | "S" | "T" | "V" | "W" | "X" | "Y" | "Z"
      firstLetter = ~notFirst validLetter
      notFirst = "W" | "Z"
    `,
  visa: `
      cardNumber = start short makeLong?
      short = digit digit digit digit digit digit digit digit digit digit digit digit 
      makeLong = digit digit digit 
      start = "4"
    `,
  masterCard: `
      cardNumber = start5 | start2
      start5 = "5" oneTo5 twelve make14
      start2 = (base2 | tail2 | general2 | secondary2) twelve
      base2 = "222" oneTo9
      secondary2 = "22" threeTo9 digit
      tail2 = "27" (before20 | twenty)
      twenty = "20"
      before20 = ("0" | "1") digit
      threeTo9 = "3"| "4"| "5"|"6" | "7" | "8"| "9"
      general2 = "2" threeTo6 digit digit
      oneTo9 ="1" | "2" | "3"| "4"| "5"|"6" | "7" | "8"| "9"
      threeTo6 = "3" | "4" | "5"| "6"
      twelve = digit digit digit digit digit digit digit digit digit digit digit digit 
      make14 = digit digit 
      oneTo5 = "1" | "2" | "3" | "4" | "5"
    `,
  adaFloat: `
      numericLiteral = basedLiteral | decimalLiteral
      decimalLiteral = numeral ("." numeral)? exponent?
      numeral = digit ("_"? digit)*
      exponent = ("E" | "e") ("+" | "-")? numeral
      basedLiteral =  base "#" basedNumeral ( "." basedNumeral )? "#" ( exponent )?
      base = numeral
      basedNumeral = extendedDigit ("_"? extendedDigit)*
      extendedDigit = digit | "A" | "B" | "C" | "D" | "E" | "F" | "a" | "b" | "c" | "d" | "e" | "f"
    `,
  notThreeEndingInOO: `
      allowed = ~notAllowed strings 
      strings = letter*
      notAllowed = (letter caseInsensitiveLetters) end
      caseInsensitiveLetters = caseInsO caseInsO
      caseInsO = caseInsensitive<"o">
    `,
  divisibleBy64: `  
      valid = padding ("1" internal ending "0"*)?
      padding = "0" *
      internal = ( x | "1")*
      x = ("0")* "1" 
      ending = "0" "0" "0" "0" "0" "0"
    `,
  eightThroughTwentyNine: `	
      valid = regDec | edge
      edge = "2" "9" ("." "0"+)?
      regDec = whole ("." digit+)?
      whole = single | tens | twenties
      single = "8" | "9"
      tens = "1" digit
      twenties = "2" oneTo8
      oneTo8 = ~"9" digit
    `,
  mLComment: `
      comment =   "(*"(~"*)" any)*  "*)"  
    `,
  notDogDoorDenNoLookAround: `
	  valid = greaterThan4 | four | three | lessThan3 
    lessThan3 = letter? letter?
    greaterThan4 = letter letter letter letter letter  letter*
    four = startsWithNoD4 | startsWithD4 | startsWithDO4 | startsWithDOO4
    three = startsWithNoD3 | startsWithD3 | startsWithDO3 | startsWithDE3
    startsWithNoD3 = noD letter letter
    startsWithD3 = "d" noOE letter
    startsWithDO3 = "do" noG
    startsWithDE3 = "de" noN
    startsWithNoD4 = noD letter letter letter
    startsWithD4 = "d" noO letter letter
    startsWithDO4 = "do" noO letter
    startsWithDOO4 = "doo" noR
    noD = "a" | "b" | "c" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z" | caps
    caps = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z" 
    noO= "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z" | caps
    noG= "a" | "b" | "c" | "d" | "e" | "f" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z" | caps
    noN= "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z" | caps
    noR= "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z" | caps
    noOE= "a" | "b" | "c" | "d" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z" | caps `,
  notDogDoorDenWithLookAround: `
      allowed = ~notAllowed strings
      notAllowed = ("dog" | "door" | "den") end
      strings = (letter)*
    `,
}

export function matches(name, string) {
  const grammar = `G {${grammars[name]}}`
  return ohm.grammar(grammar).match(string).succeeded()
}
