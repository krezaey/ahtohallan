const regexes = {
  canadianPostalCode: /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ ]\d[ABCEGHJ-NPRSTV-Z]\d$/,
  visa: /^4[0-9]{12}([0-9]{3})?$/,
  masterCard: /^^5[1-5][0-9]{14}|^222[0-9][13]|^2[0-9]{15}|^27[0-9]{14}|^20[0-9]{14}$$/,
  adaFloat: /^(([0-9]((_)?[0-9])*#[0-9A-Fa-f]((_)?[0-9A-Fa-f])*(.[0-9A-Fa-f]((_)?[0-9A-Fa-f])*)?#)|([0-9]((_)?[0-9])*(.[0-9]((_)?[0-9])*)?))((E|e)(\+|-)?[0-9]((_)?[0-9])*)?$/,
  notThreeEndingInOO: /^((?![a-zA-Z](o|O){2})[a-zA-Z]*)|([a-zA-Z](o|O){2})[a-zA-Z]+$/,
  divisibleBy64: /^0+|[0*1*]000000$/,
  eightThroughTwentyNine: /^([0])*((29(\.[0]*)?)|(([8-9]|1[0-9]|2[0-8])(\.[0-9]*)?))$/,
  mLComment: /^\(\*(\*(?!\))|[^*])*\*\)$/,
  notDogDoorDenNoLookAround: /^(([a-zA-Z]{4}[a-zA-Z]+)|(([a-cA-Ze-z][a-zA-z]{3})|(d[a-nA-Zp-z][a-zA-z]{2})|(do[a-nA-Zp-z][a-zA-z])|(doo[a-qA-Zs-z]))|(([a-cA-Ze-z][a-zA-z]{2})|(d[a-dA-Zf-np-z][a-zA-z])|(do[a-fA-Zh-z])|(de[a-mA-Zo-z]))|([a-zA-z]{0,2}))$/,
  notDogDoorDenWithLookAround: /^((?!dog|den|door)[a-zA-Z]*)|(dog|den|door)[a-zA-Z]+$/,
}

export function matches(name, string) {
  return regexes[name].test(string)
}
