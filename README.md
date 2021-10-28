<h1 align="center" style="border-bottom: none;">expression-parser</h1>
<h3 align="center">Customizable Infix to Postfix Converter/Resolver</h3>

**expression-parser** is yet another infix to postfix/reverse polish notation converter. I created it because I needed the ability to parse expressions with symbols/identifiers/variables of different formats.

## Highlights

Supports the following expression tokens:

- basic binary operators (e.g. +,-,\*,/,%,^)
- unary negation operator (e.g. -10)
- parenthesis for grouping

Supports the following operands:

- Integers (e.g. -10,1,0,1,2,3,...)
- Floating point numbers (e.g. 3.14159)
- Symbols in the form if singe upper/lower case letters (e.g. a+b-c)
- Custom symbom/variable patters (specify your own regular expression)

Detects the following expression errors:

- Too many operands
- Missing operands
- Missing opening parenthesis
- Missing closing parenthesis

Is thoughrouly unit tested.

## Installation

```
npm install @estilles/expression-parser
```

## Usage

### Importing

```JavaScript
import { parse, resolve, toString, toArray } from '@estilles/expression-parser'
```

or

```JavaScript
const { parse, resolve, toString, toArray } = require('@estilles/expression-parser')
```

### API

#### parse()

The `parse()` function takes a mathematica expression, tokenizes and parses it, then returns a parsed expression object that represents the expression in postfix or reversed polish notation (RPN).

The resulting postfix/RPN expression can be visualized by converting it to a string using `toString(parsedExpression)` or an array of tokens using `toArray(parsedExpression)` (see below).

The optional `symbolPattern` is a regular expression used to parse symbols/variables within the expression. The default `symbolPattern` is `/^([a-zA-Z])/`. It will accept single upper or lower case letters. If you want to create your `symbolPattern`, the regular expression must: (a) start with a begin anchor `^`, and (b) capture the name of the symbol/variable in the first capture group.

```JavaScript
parse(expression : String[, symbolPattern : Regex]) => parsedExpression

e.g.
parse('1+2*3/4')
parse('(a+b)^2*c')
parse('$(instance:var1) + $(instance:var2)', /^\$\(((?:[^:$)]+):(?:[^)$]+))\)/)
```

#### toString()

Converts a parsed expression to a string

```JavaScript
toString(parsedExpression) => string

e.g.
toString(parse('1+2*3/4')) => '1 2 3 * 4 / 1 +'
toString(parse('(a+b)^2*c')) => 'a b + 2 ^ c *'
```

#### toArray()

Converts a parsed expression to an array of tokens

```JavaScript
toArray(parsedExpression) => array

e.g.
toString(parse('1+2*3/4')) => ['1', '2', '3', '*', '4', '/', '1', '+']
toString(parse('(a+b)^2*c')) => ['a', 'b', '+', '2', '^', 'c', '*']
```

#### resolve(parsedExpression[, values]) -> result

Takes a parsed expression and an optional dictionary of symbol -> values, evaluates the expression and returns the result.

```JavaScript
resolve(parsedExpression[, values]) => result

e.g.
resolve(parse('1+2*3/4')) => 2.5
resolve(parse('(a+b)^2*c), { a: 1, b: 2, c: 3}) => 27
```
