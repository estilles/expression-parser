const { parse, toString } = require('../src')
const expect = require('chai').expect

describe('parser', function () {
	describe('operator precedence', function () {
		it('should handle expressions with single operators', function () {
			const result = parse('a + b')
			expect(toString(result)).to.equal('a b +')
		})

		it('should handle multiple operators with same precedence', function () {
			const result = parse('a + b - c')
			expect(toString(result)).to.equal('a b + c -')
		})

		it('should handle multiple operators with different precedence', function () {
			const result = parse('a + b * c')
			expect(toString(result)).to.equal('a b c * +')
		})

		it('should handle parenthesis', function () {
			const result = parse('(a + b) * c')
			expect(toString(result)).to.equal('a b + c *')
		})

		it('should handle embedded parenthesis', function () {
			const result = parse('((a + b) / (c + d)) ^ (e % 2)')
			expect(toString(result)).to.equal('a b + c d + / e 2 % ^')
		})
	})

	describe('unary negative', function () {
		it('should handle at the beginning of the expression', function () {
			const result = parse('-a + b')
			expect(toString(result)).to.equal('a ~ b +')
		})

		it('should handle in the middle of an expression', function () {
			const result = parse('-a + -b')
			expect(toString(result)).to.equal('a ~ b ~ +')
		})

		it('should handle before open parenthesis', function () {
			const result = parse('a + (-b + c)')
			expect(toString(result)).to.equal('a b ~ c + +')
		})
	})

	describe('syntax errors', function () {
		it('should detect invalid tokens', function () {
			const fn = () => parse('a @ b')
			expect(fn).to.throw()
		})

		it('should detect empty parenthesis', function () {
			const fn = () => parse('()')
			expect(fn).to.throw(/Empty parenthesis/)
		})

		it('should detect missing parenthesis', function () {
			const fn = () => parse('a * ( b +')
			expect(fn).to.throw()
		})
	})
})
