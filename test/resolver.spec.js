const { parse, resolve } = require('../src')
const expect = require('chai').expect

describe('resolver', function () {
	describe('expressions with literal operand', function () {
		it('should handle addition', function () {
			const result = resolve(parse('1 + 2'))
			expect(result).to.equal(3)
		})

		it('should handle addition', function () {
			const result = resolve(parse('3 - 4'))
			expect(result).to.equal(-1)
		})

		it('should handle multiplication', function () {
			const result = resolve(parse('5 * 6'))
			expect(result).to.equal(30)
		})

		it('should handle division', function () {
			const result = resolve(parse('7 / 8'))
			expect(result).to.equal(0.875)
		})

		it('should handle exponentiation', function () {
			const result = resolve(parse('2 ^ 8'))
			expect(result).to.equal(256)
		})

		it('should handle unary negation', function () {
			const result = resolve(parse('-1 + -2'))
			expect(result).to.equal(-3)
		})

		it('should handle consective unary negation', function () {
			const result = resolve(parse('--1 + 1'))
			expect(result).to.equal(2)
		})

		it('should handle consective unary negation with parenthesis', function () {
			const result = resolve(parse('-(-1) + 1'))
			expect(result).to.equal(2)
		})

		it('should handle negation of expression within parenthesis', function () {
			const result = resolve(parse('-(-1 + -1)'))
			expect(result).to.equal(2)
		})

		it('should handle multiple operators', function () {
			const result = resolve(parse('((2 + 2) * 3 / 4) ^ 3 % 2'))
			expect(result).to.equal(1)
		})

		it('should handle floating point literals', function () {
			const result = resolve(parse('1.234 * 2'))
			expect(result).to.equal(2.468)
		})

		it('should handle division by zero', function () {
			const result = resolve(parse('1 / 0'))
			expect(result).to.equal(Infinity)
		})
	})

	describe('expressions with symbol/variable operands', function () {
		it('should handle symbol and literal operands', function () {
			const postfix = parse('a + 1')
			const variables = { a: 2 }
			expect(resolve(postfix, variables)).to.equal(3)
		})

		it('should handle multiple symbol operands', function () {
			const postfix = parse('a ^ 2 + 2 * b + c')
			const variables = { a: 3, b: 2, c: 1 }
			expect(resolve(postfix, variables)).to.equal(14)
		})

		it('should handle duplicate symbol operands', function () {
			const postfix = parse('a / a')
			const variables = { a: 10 }
			expect(resolve(postfix, variables)).to.equal(1)
		})
	})

	describe('expressions with errors', function () {
		it('should detect missing symbol values', function () {
			const fn = () => resolve(parse('a + 1'))
			expect(fn).to.throw(/Missing values/)
		})

		it('should detect missing operands', function () {
			const fn = () => resolve(parse('1 +'))
			expect(fn).to.throw(/Missing operands/)
		})

		it('should detect extraneous operands', function () {
			const fn = () => resolve(parse('10 + 10 20 30'))
			expect(fn).to.throw(/Too many operands/)
		})
	})
})
