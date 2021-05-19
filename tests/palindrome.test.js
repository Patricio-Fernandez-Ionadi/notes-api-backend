// en el package.json especificamos que jest se ejecutara en el entorno de node
// jest ejecutará este archivo, no hace falta importar el modulo (require('...'))
// lo que si deberemos importar es el metodo a testear

const { palindrome } = require("../utils/for_testing")

test("palindrome of poker", () => {
	const result = palindrome("poker")
	expect(result).toBe("rekop")
})

test("palindrome of empty string", () => {
	const result = palindrome("")
	expect(result).toBe("")
})

test("palindrome of undefined", () => {
	const result = palindrome()
	expect(result).toBeUndefined()
})
