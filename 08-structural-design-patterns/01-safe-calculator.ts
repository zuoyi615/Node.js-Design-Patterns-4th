import { StackCalculator } from './01-proxy-composition.ts'

export class SafeCalculator {
  #calculator: StackCalculator

  constructor(calculator: StackCalculator) {
    this.#calculator = calculator
  }

  divide() {
    const divisor = this.#calculator.peekValue()

    if (divisor === 0) {
      throw new Error('Division by 0')
    }

    return this.#calculator.divide()
  }

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
const safeCalculator = new SafeCalculator(calculator)

calculator.putValue(3)
calculator.putValue(2)
console.log(calculator.multiply()) // 6

safeCalculator.putValue(2)
console.log(safeCalculator.multiply()) // 12

calculator.putValue(0)
console.log(calculator.divide()) // Infinity

safeCalculator.clear()
safeCalculator.putValue(4)
safeCalculator.putValue(0)
console.log(safeCalculator.divide()) // Error

