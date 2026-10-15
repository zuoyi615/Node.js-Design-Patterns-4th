import { StackCalculator } from './stack-calculator.ts'

const methods = ['putValue', 'getValue', 'peekValue', 'clear', 'multiply'] as const
type Method = (typeof methods)[number]
type SafeCalculator = Pick<StackCalculator, 'divide'> & Record<Method, (...args: any[]) => void>

function createSafeCalculator(calculator: StackCalculator) {
  const safeCalculator: SafeCalculator = {
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
  }

  for (const method of methods) {
    safeCalculator[method] = calculator[method].bind(calculator)
  }

  return safeCalculator
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

