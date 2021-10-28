const { tokenize } = require('../src')
const expect = require('chai').expect

describe('tokenizer', function () {
	describe('expressions with numeric operands', function () {
		it('should tokenize numeric operands and operators', function () {
			const result = tokenize('1+2')

			expect(result).to.have.lengthOf(3)

			expect(result[0]).to.have.property('value')
			expect(result[0].value).to.equal(1)
			expect(result[0].position).to.equal(1)

			expect(result[1]).to.have.property('symbol')
			expect(result[1].symbol).to.equal('+')
			expect(result[1].position).to.equal(2)

			expect(result[2]).to.have.property('value')
			expect(result[2].value).to.equal(2)
			expect(result[2].position).to.equal(3)
		})

		it('should tokenize expression with multple operators', function () {
			const result = tokenize('10+20*30/40^50%2')

			expect(result).to.have.lengthOf(11)

			expect(result[0].value).to.equal(10)
			expect(result[1].symbol).to.equal('+')
			expect(result[2].value).to.equal(20)
			expect(result[3].symbol).to.equal('*')
			expect(result[4].value).to.equal(30)
			expect(result[5].symbol).to.equal('/')
			expect(result[6].value).to.equal(40)
			expect(result[7].symbol).to.equal('^')
			expect(result[8].value).to.equal(50)
			expect(result[9].symbol).to.equal('%')
			expect(result[10].value).to.equal(2)
		})

		it('should ignore spaces, preserving token position', function () {
			const result = tokenize(' 1 + 2 * 3 ')

			expect(result).to.have.lengthOf(5)

			expect(result[0].position).to.equal(2)
			expect(result[1].position).to.equal(4)
			expect(result[2].position).to.equal(6)
			expect(result[3].position).to.equal(8)
			expect(result[4].position).to.equal(10)
		})

		it('should tokenize parenthesis', function () {
			const result = tokenize('(1+2)*3')

			expect(result).to.have.lengthOf(7)

			expect(result[0].symbol).to.equal('(')
			expect(result[4].symbol).to.equal(')')
		})
	})

	describe('expressions with operand symbols', function () {
		it('should tokenize symbols using default pattern/regex', function () {
			const result = tokenize('a+b')

			expect(result[0].name).to.equal('a')
			expect(result[2].name).to.equal('b')
		})

		it('should tokenize symbols using custom pattern/regex', function () {
			const result = tokenize('$(instance:var1) + $(instance:var2)', /^\$\(((?:[^:$)]+):(?:[^)$]+))\)/)

			expect(result[0].name).to.equal('instance:var1')
			expect(result[0].value).to.be.NaN

			expect(result[2].name).to.equal('instance:var2')
			expect(result[2].value).to.be.NaN
		})
	})

	describe('invalid expressions', function () {
		it('should return an empty array if expression is empty', function () {
			expect(tokenize('')).to.have.lengthOf(0)
		})

		it('should throw an exception on invalid tokens', function () {
			const fn = () => tokenize('1+2!')
			expect(fn).to.throw('position 4')
		})
	})
})
