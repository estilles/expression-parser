const { SYMBOL_PATTERN } = require('./utils').paterns
const { NEGATION } = require('./utils').operators

const { tokenize } = require('./tokenize')

const parse = (expression = '', symbolPattern = SYMBOL_PATTERN) => {
	const tokens = tokenize(expression, symbolPattern)
	const stack = []
	const parsed = []
	let current = null
	let previous = null

	for (let index = 0; index < tokens.length; index++) {
		previous = current
		current = tokens[index]

		// process operands
		if ('value' in current) {
			parsed.push(current)
			continue
		}

		// check for unary minus sign
		if (current.symbol === '-') {
			if (previous === null || previous.symbol === '(') {
				stack.push({
					...NEGATION,
					position: current.position,
				})
				continue
			}
			// if (previous.symbol === '~') {
			if (['+', '-', '*', '/', '%', '~'].includes(previous.symbol)) {
				stack.push({
					...NEGATION,
					position: current.position,
				})
				continue
			}
		}

		// always push open parenthesis to stack
		if (current.symbol === '(') {
			stack.push(current)
			continue
		}

		// Check for closed parenthesis
		if (current.symbol === ')') {
			let last = stack.pop()

			if (last.symbol === '(') {
				throw Error('Empty parenthesis')
			}

			while (last && last.symbol !== '(') {
				parsed.push(last)
				last = stack.pop()
			}

			// Check for missing opening operenthesis
			if (last === undefined) {
				throw Error('Missing opening parenthesis')
			}
			continue
		}

		// Pop all higher precedence operators (until open parenthesis or empty)
		while (stack.length && stack[stack.length - 1].symbol !== '(') {
			if (current.precedence <= stack[stack.length - 1].precedence) {
				parsed.push(stack.pop())
			} else {
				break
			}
		}

		// push current operator
		stack.push(current)
	}

	// empty stack
	while (stack.length) {
		const last = stack.pop()

		// Check for missing closing operenthesis
		if (last.symbol === '(') {
			throw Error('Missing closing parenthesis')
		}
		parsed.push(last)
	}

	return parsed
}

module.exports = {
	parse,
}
