const resolve = (parsed = [], variables = {}) => {
	const stack = []

	// check for missing variable values
	const missingVariables = parsed
		.filter((token) => 'name' in token)
		.filter((token) => {
			if (token.name in variables) {
				token.value = parseFloat(variables[token.name])
				if (!isNaN(token.value)) {
					return false
				}
			}
			return true
		})
		.map(({ name }) => name)
		.join(',')

	if (missingVariables) {
		throw new Error(`Missing values for operands: ${missingVariables}`)
	}

	for (let index = 0; index < parsed.length; index++) {
		const current = parsed[index]

		// process operands
		if ('value' in current) {
			stack.push(current.value)
			continue
		}

		if (stack.length < current.args) {
			throw Error('Missing operands')
		}

		const values = []
		for (let count = 1; count <= current.args; count++) {
			values.unshift(parseFloat(stack.pop()))
		}

		stack.push(current.calc(...values))
	}

	// only the result should remain in the stack
	if (stack.length !== 1) {
		throw Error('Too many operands')
	}

	return stack.pop()
}

module.exports = {
	resolve,
}
