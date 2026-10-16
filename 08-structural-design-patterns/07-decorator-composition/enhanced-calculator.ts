import { StackCalculator } from './stack-calculator.ts'

class EnhancedCalculator {
  #calculator: StackCalculator

  constructor(calculator: StackCalculator) {
    this.#calculator = calculator
  }

  // add new method
  add() {
    const addend2 = this.#calculator.peekValue()
    const addend1 = this.#calculator.peekValue()
    const result = addend1 + addend2
    this.putValue(result)
    return result
  }

  // modified method
  divide() {
    const divisor = this.#calculator.peekValue()

    if (divisor === 0) {
      throw new Error('Division by 0')
    }

    return this.#calculator.divide()
  }

  // delegated methods
  putValue(value: number) {
    return this.#calculator.putValue(value)
  }

  getValue() {
    return this.#calculator.getValue()
  }

  peekValue() {
    return this.#calculator.peekValue()
  }

  clear() {
    return this.#calculator.clear()
  }

  multiply() {
    return this.#calculator.multiply()
  }
}

const calculator = new StackCalculator()
const enhancedCalculator = new EnhancedCalculator(calculator)

enhancedCalculator.putValue(4)
enhancedCalculator.putValue(3)
console.log(enhancedCalculator.add()) // 4+3 = 7
enhancedCalculator.putValue(2)
console.log(enhancedCalculator.multiply()) // 7*2 = 14
// enhancedCalculator.putValue(0)
// console.log(enhancedCalculator.divide()) // 14/0 -> Error('Division by 0')
