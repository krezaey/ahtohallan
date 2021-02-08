# Ahtohallan

## Introduction

## Features

## Types and Variable Declaration

| Types      | Types in Ahtohallan   | Variable Declaration                                                                     |
| ---------- | --------------------- | ---------------------------------------------------------------------------------------- |
| int        | `Anna`                | `Anna x = 5 ❅`                                                                           |
| float      | `Else`                | `Elsa y = 3.6 ❅`                                                                         |
| string     | `Olaf`                | `Olaf z = "I like telling stories!" ❅`                                                   |
| boolean    | `Love`                | `Love bool = Hans ❅`                                                                     |
| true       | `Kristoff`            | `Love isGood = Kristoff ❅`                                                               |
| false      | `Hans`                | `Love isEvil = Hans ❅`                                                                   |
| array      | `Herd`                | `Olaf Herd[] = ["Carrot", "Coal", "Twigs", "Warm Hugs"] ❅`                               |
| dictionary | `Trolls[[Key:Value]]` | `Trolls[[Olaf:Love]] annaLoveHistory = ["Hans loved Anna." : Hans, "Kristoff loves Anna." : Kristoff] ❅` |
| none       | `Samantha`            | `Elsa a = Samantha ❅`                                                                    |

Variables at declaration should be indicated whether they are constants or not. The examples of types and variable declaration above do not include the ```Meltable``` and ```Unmeltable``` keywords but would be expected otherwise. 

| Variable Declaration Keywords | Javascript | Meaning | Example | 
| ----------------------------- | ---------- | ------- | ------- |
| ```Meltable``` | ```let``` | value may be changed |```Meltable Olaf x = "You may change my value ❅``` | 
| ```Unmeltable``` | ```const``` | value may NOT be changed | ```Unmeltable Olaf y = "DO NOT CHANGE ME" ❅ ``` | 

## Key Words

## Operators

| Operation             | Operation in Ahtohallan | Performing Operation  |
| --------------------- | ----------------------- | --------------------- | 
| add                   | `+`                     | `Anna x = 2 + 3 ❅`    |
| subtract              | `-`                     | `Elsa y = 10 - 5 ❅`   |
| multiply              | `*`                     | `Anna z = 2 * 3 ❅`    |
| divide                | `/`                     | `Elsa a = 100 / 10 ❅` |
| modulo                | `%`                     | `Anna b = 10 % 3 ❅ `  |
| equals                | `==`                    | `x == y`              |
| not equals            | ```!=```                | ```x != y ```         |
| less than             | `<`                     | `1 < 2`               |
| greater than          | `>`                     | `2 > 1`               |
| less than or equal    | `<=`                    | `2 <= 2`              |
| greater than or equal | `>=`                    | `4 >= 1`              |
| logical and           | `&&`                    | `(1 < 2) && (2 < 3)`  |
| logical or            | `\|\|`                  | `(1 < 2) \|\| (2 < 3)`|
| logical not           | `!`                     | `Love x = !Hans ❅`    |

## Comments 
Single and multi-lined comments are encased in ```~*``` and ```~*``` at the beginning and the end of comments respectively. With multi-lined comments, it is not required to insert ```*``` at the beginning of each new line, but it is recommended. 

```
~* This is a single-line comment. *~

~* This is a
 * multi-lined
 * comment. 
~*
```

## Functions and Classes

### Functions

In Ahtohallan functions are declared using the keyword `Ice`.
This is followed by a return type and a function name. The paramaters are in
`()` and each parameter has

## Control Flow

### For Loops
```
```

### If, Else If, Else Statements
```
~* This is an if statement, followed by an else if, than an else. *~

Get~This~Right(x < 1) {
  sing("X is less than 1!") ❅
} The~Next~Right~Thing(x == 1) {
  sing("X is equal to 1!") ❅
} Into~The~Unknown {
  sing("X is neither less than 1 or equal to 1, meaning it is greater!") ❅
}
```

### Switch Statements
```
All~Is~Found(expression) {
  Show~Yourself(case1):
    ~* code block for case 1 here *~
    break ❅
  Show~Yourself(case2):
    ~* code block for case 2 here *~
    break ❅
  I~Seek~The~Truth: 
    ~* code block for the default here *~
    break ❅
}
```

### While Loops
```
Lost~In~The~Woods(x != Hans) {
  ~* code block here *~
}
```

## Examples

### 1. Here is the iconic Hello, World! print statement

Ahtohallan:

```
sing("I wanna get this right, baby!") ❅
```

JavaScript:

```
console.log("Hello, World!");
```

### 2. Here is a simple function to square a number

  Ahtohallan:

```
Ice Anna Square (Anna Number) {
  Arendelle Number * Number ❅
}
```

  JavaScript:

```
function square (number) {
  return number * number;
}
```
