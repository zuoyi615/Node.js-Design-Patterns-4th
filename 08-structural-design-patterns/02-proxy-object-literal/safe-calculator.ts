import { StackCalculator } from './stack-calculator.ts'

function createSafeCalculator(calculator: StackCalculator) {
  return {
    // proxied method
    divide() {
      // additional validation logic
      const divisor = calculator.peekValue()
      if (divisor === 0) {
        throw new Error('Division by 0')
      }
      // if valid delegates to the subject
      return calculator.divide()
    },
    // delegated methods
    putValue(value: number) {
      return calculator.putValue(value)
    },
    getValue() {
      return calculator.getValue()
    },
    peekValue() {
      return calculator.peekValue()
    },
    clear() {
      return calculator.clear()
    },
    multiply() {
      return calculator.multiply()
    },
  }
}


const calculator = new StackCalculator()
const safeCalculator = createSafeCalculator(calculator)

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

