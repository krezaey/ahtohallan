const regexes = {
  canadianPostalCode: /^________$/,
  visa: /^________$/,
  masterCard: /^________$/,
  adaFloat: /^________$/,
  notThreeEndingInOO: /^________$/,
  divisibleBy64: /^________$/,
  eightThroughTwentyNine: /^________$/,
  mLComment: /^________$/,
  notDogDoorDenNoLookAround: /^________$/,
  notDogDoorDenWithLookAround: /^________$/,
}

export function matches(name, string) {
  return regexes[name].test(string)
}