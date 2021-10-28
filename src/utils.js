// Patterns
const SYMBOL_PATTERN = /^([a-zA-Z])/
const NUMBER_PATTERN = /^[0-9]*\.?[0-9]+/
const WHITESPACE_PATTERN = /^\s+/

// For Companion variables /^\$\(((?:[^:$)]+):(?:[^)$]+))\)/

// Operators
const ADDITION = { symbol: '+', pattern: /^\+/, precedence: 0, args: 2, calc: (a, b) => a + b }
const SUBTRACTION = { symbol: '-', pattern: /^\-/, precedence: 0, args: 2, calc: (a, b) => a - b }
const MULTIPLICATION = { symbol: '*', pattern: /^\*/, precedence: 1, args: 2, calc: (a, b) => a * b }
const DIVISION = { symbol: '/', pattern: /^\//, precedence: 1, args: 2, calc: (a, b) => a / b }
const MODULUS = { symbol: '%', pattern: /^\%/, precedence: 1, args: 2, calc: (a, b) => a % b }
const EXPONENTIATION = { symbol: '^', pattern: /^\^/, precedence: 2, args: 2, calc: (a, b) => a ** b }

const NEGATION = { symbol: '~', pattern: /^\-/, precedence: 0, args: 1, calc: (a) => -a }

const OPENING_PARENTHESIS = { symbol: '(', pattern: /^\(/, precedence: 3 }
const CLOSING_PARENTHESIS = { symbol: ')', pattern: /^\)/, precedence: 3 }

const toString = (list = []) =>
	list
		.reduce((result, token) => {
			if ('name' in token) {
				return `${result} ${token.name}`
			}
			if ('symbol' in token) {
				return `${result} ${token.symbol}`
			}
			return `${result} ${token.value}`
		}, '')
		.trim()

const toArray = (list = []) =>
	list.map((token) => {
		if ('name' in token) {
			return token.name
		}
		if ('symbol' in token) {
			return token.symbol
		}
		return token.value
	})

const getNextToken = (expression, position, regex) => {
	const match = expression.substring(position).match(regex)
	if (match) {
		return { match, position: position + match[0].length }
	} else {
		return { match: null, position }
	}
}

module.exports = {
	paterns: {
		SYMBOL_PATTERN,
		NUMBER_PATTERN,
		WHITESPACE_PATTERN,
	},
	operators: {
		ADDITION,
		SUBTRACTION,
		MULTIPLICATION,
		DIVISION,
		MODULUS,
		EXPONENTIATION,
		OPENING_PARENTHESIS,
		CLOSING_PARENTHESIS,
		NEGATION,
	},
	toString,
	toArray,
	getNextToken,
}
