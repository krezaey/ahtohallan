<h1 align="center">
Ahtohallan
<h1>
<p align="center">
   <img align="center" src="docs/ahtohallan_logo.png" alt="logo" width="500" />
<p>

## Introduction

Hello, hello, and welcome to the show! This is Ahtohallan, a magical language from the depths of the FCU (Frozen Cinematic
Universe). Although it is inspired by our love of the FCU, one doesn't
need to be a Frozen connoisseur to understand or use Ahtohallan!
If you are, however, we hope you have fun seeing all the magical things
water, code, and a little bit of love can offer!

In no particular order, Ahtohallan was made by Keziah Rezaey, Salem Tesfu, Michael Elias, Ameya Mellacheruvu, Onariaginosa Igbinedion, & Elise Sawan.

You can learn more about our language and us on our [website](https://krezaey.github.io/ahtohallan/).
You can view the grammar of our language [here](https://github.com/krezaey/ahtohallan/blob/main/src/ahtohallan.ohm).

## Features

Ahtohallan introduces these language features:

- An object oriented programming language reminiscent of JavaScript
- Frozen casing: A style of casing where everything is capitalized, and
  separated by `~` Like~This ! Additionally, all keywords should be capitalized.
- Like ice, the language is strong and dynamic
- No primitive types
- Typed parameters 
- Function return types
- Minimal Built-in functions
- In Ahtohallan, you can break and return from programs! You are not limited to being within a loop/switch statement, or a function. You can halt a program, or make a program return a value. How magical!
- Introducing universe appropriate error messages! 

## Key Words

| Ahtohallan             | Keywords    |
| ---------------------- | ----------- |
| `Water`                | constructor |
| `Snow`                 | class       |
| `Ice`                  | function    |
| `Crystal`              | method      |
| `Get~This~Right`       | if          |
| `The~Next~Right~Thing` | else if     |
| `Into~The~Unknown`     | else        |
| `Let~It~Go`            | for         |
| `Lost~In~The~Woods`    | while       |
| `All~Is~Found`         | switch      |
| `Show~Yourself`        | case        |
| `I~Seek~The~Truth`     | default     |
| `Sing`                 | print       |
| `Frozen`               | this        |
| `Open~Door`            | new         |
| `Closed~Door`          | break       |
| `Arendelle`            | return      |

## Types and Variable Declaration

| Types      | Types in Ahtohallan | Variable Declaration                                                                                              |
| ---------- | ------------------- | ----------------------------------------------------------------------------------------------------------------- |
| int        | `Anna`              | `Meltable Anna x = 5 ❅`                                                                                           |
| float      | `Elsa`              | `Unmeltable Elsa y = 3.6 ❅`                                                                                       |
| string     | `Olaf`              | `Meltable Olaf z = "I like telling stories!" ❅`                                                                   |
| boolean    | `Love`              | `Unmeltable Love bool = Hans ❅`                                                                                   |
| true (boolean)      | `Kristoff`          | `Meltable Love isGood = Kristoff ❅`                                                                               |
| false (boolean)     | `Hans`              | `Unmeltable Love isEvil = Hans ❅`                                                                                 |
| array      | `Herd`              | `Meltable Herd[] me = ["Carrot", "Coal", "Twigs", "Warm Hugs"] ❅`                                                 |
| dictionary | `Trolls[[]]`        | `Unmeltable Trolls[[]] annaLoveHistory = [["Hans loved Anna." : Hans ❅ , "Kristoff loves Anna." : Kristoff ❅]] ❅` |
| none       | `Samantha`          | `Meltable Elsa n = Samantha ❅`                                                                                    |
Note: Regarding Herds, key values can only be of type Anna, Elsa, Olaf! Value types are unrestricted!


To access these elements of Herd[] or Trolls[[]] types, simply use the respective bracket notation:
```
Meltable Herd[] me = ["Carrot", "Coal", "Twigs", "Warm Hugs"] ❅
~* We used single brackets at Herd[] declaration, so access as such! *~
Sing(me[0]) ❅

Unmeltable Trolls[[]] annaLoveHistory = [["Hans loved Anna." : Hans ❅ , "Kristoff loves Anna." : Kristoff ❅]] ❅
~* We used double brackets at Trolls[[]] declaration, so access as such! *~
Sing(annaLoveHistory[["Hans loved Anna."]]) ❅

```
Variables at declaration should be indicated whether they are constants or not. The examples of types and variable declaration above do not include the `Meltable` and `Unmeltable` keywords but would be expected otherwise.

| Variable Declaration Keywords | Javascript | Meaning                  | Example                                                        |
| ----------------------------- | ---------- | ------------------------ | -------------------------------------------------------------- |
| `Meltable`                    | `let`      | value may be changed     | `Meltable Olaf x = "You may change my value" ❅`                |
| `Unmeltable`                  | `const`    | value may NOT be changed | `Unmeltable Olaf y = "DO NOT CHANGE ME, I HAVE PERMAFROST" ❅ ` |

## Operators

| Operation             | Operation in Ahtohallan | Performing Operation              |
| --------------------- | ----------------------- | --------------------------------- |
| add                   | `+`                     | `Unmeltable Anna x = 2 + 3 ❅`     |
| subtract              | `-`                     | `Meltable Elsa y = 10 - 5 ❅`      |
| multiply              | `*`                     | `Unmeltable Anna z = 2 * 3 ❅`     |
| divide                | `/`                     | `Meltable Elsa a = 100 / 10 ❅`    |
| modulo                | `%`                     | `Unmeltable Anna b = 10 % 3 ❅ `   |
| exponentiation        | ```**```                | ```y = x**2 ❅ ```                 |
| equals                | `==`                    | `x == y`                          |
| not equals            | `!=`                    | `x != y `                         |
| less than             | `<`                     | `1 < 2`                           |
| greater than          | `>`                     | `2 > 1`                           |
| less than or equal    | `<=`                    | `2 <= 2`                          |
| greater than or equal | `>=`                    | `4 >= 1`                          |
| logical and           | `&&`                    | `(1 < 2) && (2 < 3)`              |
| logical or            | `\|\|`                  | `(1 < 2) \|\| (2 < 3)`            |
| logical not           | `!`                     | `Love x = !Hans ❅`                |
| increment             | `++`                    | `x++ ❅`                           |
| decrement             | `--`                    | `x-- ❅`                           |
| increment assignment  | `+=`                    | `x += 1 ❅`                        |
| decrement assignment  | `-=`                    | `x -= 1 ❅`                        |

## Comments

Single and multi-line comments are encased in `~*` and `*~` at the beginning and the end of comments respectively. With multi-line comments, it is not required to insert `*` at the beginning of each new line, but it is recommended.

```
~* This is a single-line comment. *~

~*
 * This is a
 * multi-lined
 * comment.
*~

~* This is also
   a multi-lined
   comment.
*~
```

## Functions and Classes

### Functions

In Ahtohallan functions are declared using the keyword `Ice`.
This is followed by a return type and a function name. The parameters are in `()` and each parameter has a type and a name. The function block is denoted by `{}`.

```
Ice Samantha Function~Name(Olaf String, Anna Int, Elsa Float) {
  ~* This is a comment *~
  Sing("Hello, Hello, and Welcome to my Show") ❅
}
```

### Classes

In Ahtohallan classes are declared using the keyword `Snow` followed by the class name. You can create a constructor using the keyword `Water`. Constructors use the same syntax as functions except there is no return type or name. Methods are instantiated using the keyword `Crystal`. (Isn't that so cute? To create an instance of snow you need water! Not only that, but a method of Snow is Crystal. You can have many Snow Crystals in an instance of Snow!) Fields are referred to as "Snowflakes".

```
Snow Name {
  ~* Class Snowflakes go here *~
  Unmeltable Olaf String~Name = "Who can handle this enormous candle? Unmeltable me" ❅

  Water (Olaf String, Anna Int, Elsa Float) {
    ~* Instance Snowflakes go here *~
    Frozen.String = String ❅
    Frozen.Int = Int ❅
    Frozen.Float = Float ❅
  }

  Crystal Samantha Method~Name() {
    ~* This is a method that does nothing!!! *~
  }
}
```

## Control Flow

### For Loops

```
Let~It~Go (Meltable Anna i = 0 ❅ i < 10 ❅ i++ ❅) { 
  ~* Code block here *~
}
```

### If, Else If, Else Statements

```
~* This is an if statement, followed by an else if, than an else. *~

Get~This~Right (x < 1 ❅) {
  Sing("X is less than 1!") ❅
}
The~Next~Right~Thing (x == 1 ❅) {
  Sing("X is equal to 1!") ❅
}
Into~The~Unknown {
  Sing("X is neither less than 1 or equal to 1, meaning it is greater!") ❅
}
```

### Switch Statements

```
All~Is~Found(expression ❅) {
  Show~Yourself(case1):
    ~* Code block for case 1 here *~
    Closed~Door ❅
  Show~Yourself(case2):
    ~* Code block for case 2 here *~
    Closed~Door ❅
  I~Seek~The~Truth:
    ~* Code block for the default here *~
    Closed~Door ❅
}
```

### While Loops

```
Lost~In~The~Woods (x == Kristoff ❅) {
  ~* Code block here *~
}
```

## Semantic Errors

Ahtohallan defines these as semantic errors: 

- Non-distinct fields in classes
- Accessing fields that do not exist in classes
- Immutable variables being changed
- Non-integer increment or decrement operations
- Undeclared identifiers
- Redeclared identifiers
- Assigning the wrong type to variable at declaration / assignment
- Number of arguments do not match the number of parameters
- Argument types do not match the parameter types
- Returning the wrong type from a function 
- Returning a type from a void function
- Returning nothing from a non-void function 
- Calling an uncallable
- Non-boolean consequent in control flow statements
- Mismatched types for operations

## Examples

### 1. Here is the iconic Hello, World! print statement.

Ahtohallan:

```
Sing("I wanna get this right, baby!") ❅
```

JavaScript:

```
console.log("Hello, World!");
```

### 2. Here is a simple function to square a number.

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

### 3. Here is a function that determines whether a number is even or odd by returning a string.

Athohallan:

```
Ice Olaf Even~Odd(Anna num) {
  Get~This~Right (num % 2 == 0 ❅) {
    Arendelle "This number is even." ❅
  }
  Into~The~Unknown {
    Arendelle "This number is odd." ❅
  }
}
```

Javascript:

```
function evenOdd(num) {
  if (num % 2 === 0) {
    return "This number is even.";
  }
  else {
    return "This number is odd.";
  }
}
```

### 4. Here is the infamous FizzBuzz problem.

Ahtohallan:

```
Ice Samantha Fizz~Buzz() {
  Let~It~Go (Meltable Anna i = 0 ❅ i <= 100 ❅ i++ ❅) {
    Get~This~Right (i % 3 == 0 && i % 5 == 0 ❅) {
      Sing("FizzBuzz") ❅
    }
    The~Next~Right~Thing (i % 3 == 0 ❅) {
      Sing("Fizz") ❅
    }
    The~Next~Right~Thing (i % 5 == 0 ❅) {
      Sing("Buzz") ❅
    }
    Into~The~Unknown {
      Sing(i) ❅
    }
  }
}
```

Javascript:

```
function fizzBuzz() {
  for (let i = 1; i <= 100; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      console.log("FizzBuzz");
    } else if (i % 3 === 0) {
      console.log("Fizz");
    } else if (i % 5 === 0) {
      console.log("Buzz");
    } else {
      console.log(i);
    }
  }
}
```

### 5. Here is an ice block that handles a Herd and an instance of Trolls.

Ahtohallan:

```
Meltable Herd[] Vegetables = ["Cabbage", "Turnip", "Radish", "Carrot"] ❅
Sing(Vegetables) ❅
~* ["Cabbage", "Turnip", "Radish", "Carrot"] *~

Unmeltable Trolls[[]] reindeer = [[
  First~Name: "Sven" ❅,
  Last~Name: "Bjorgman" ❅,
  Age: 16 ❅,
  Species: "Reindeer" ❅
]] ❅

Sing(reindeer[[Age]]) ❅

```

JavaScript:

```
let vegetables = ['Cabbage', 'Turnip', 'Radish', 'Carrot'];
console.log(vegetables);
// ["Cabbage", "Turnip", "Radish", "Carrot"];

const reindeer = {
  firstName: "Sven",
  lastName: "Bjorgman",
  age: 16,
  species: "Reindeer"
};

console.log(reindeer[age]);
```
