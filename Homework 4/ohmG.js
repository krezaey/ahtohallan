import ohm from 'ohm-js'

const grammars = {
  canadianPostalCode: `CPC {
    code = fsa " " ldu
    fsa = firstLetter digit validLetter
    ldu = digit validLetter digit
    validLetter = "A" | "B" | "C" | "E" | "G" | "H" | "J" | "K" | "L" | "M" | "N" | "P" | "R" | "S" | "T" | "V" | "W" | "X" | "Y" | "Z"
    firstLetter = ~notFirst validLetter
    notFirst = "W" | "Z"
    }`,
  visa: `Visa {
    cardNumber = start short makeLong?
    short = digit digit digit digit digit digit digit digit digit digit digit digit 
    makeLong = digit digit digit 
    start = "4"
    }`,
  masterCard: `MasterCard {
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
    }`,
  adaFloat: `________`,
  notThreeEndingInOO: `________`,
  divisibleBy64: `________`,
  eightThroughTwentyNine: `________`,
  mLComment: `________`,
  notDogDoorDenNoLookAround: `________`,
  notDogDoorDenWithLookAround: `________`,
}

export function matches(name, string) {
  const grammar = `G {${grammars[name]}}`
  return ohm.grammar(grammar).match(string).succeeded()
}