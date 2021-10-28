const { getNextToken } = require('./utils')

const { SYMBOL_PATTERN, NUMBER_PATTERN, WHITESPACE_PATTERN } = require('./utils').paterns

const operators = require('./utils').operators

const tokenize = (expression = '', symbolPattern = SYMBOL_PATTERN) => {
	const tokens = []
	let position = 0

	while (position < expression.length) {
		let match = null

		// ignore whitespace
		;({ match, position } = getNextToken(expression, position, WHITESPACE_PATTERN))
		if (match) {
			continue
		}

		// check for operand symbols
		;({ match, position } = getNextToken(expression, position, symbolPattern))
		if (match) {
			tokens.push({ name: match[1], position, value: NaN })
			continue
		}

		// check for operand number literals
		;({ match, position } = getNextToken(expression, position, NUMBER_PATTERN))
		if (match) {
			tokens.push({ position, value: parseFloat(match[0]) })
			continue
		}

		// check for operators
		Object.keys(operators)
			.map((name) => operators[name])
			.some((operator) => {
				;({ match, position } = getNextToken(expression, position, operator.pattern))
				if (match) {
					tokens.push({ ...operator, position })
					return true
				}
			})

		if (!match) {
			throw Error(`Syntax error at position ${position + 1}`)
		}
	}

	return tokens
}

module.exports = {
	tokenize,
}
