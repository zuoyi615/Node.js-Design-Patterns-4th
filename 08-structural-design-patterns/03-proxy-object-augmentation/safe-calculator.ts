import { StackCalculator } from './stack-calculator.ts'

// most simple way: monkey patch for one or a few methods
// dangerous: mutate the `subject` directly
function patchToSafeCalculator(calculator: StackCalculator) {
  const { divide } = calculator
  calculator.divide = () => {
    const divisor = calculator.peekValue()
    if (divisor === 0) {
      throw new Error('Division by 0')
    }

    return divide.apply(calculator)
  }

  return calculator
}

const calculator = new StackCalculator()
const safeCalculator = patchToSafeCalculator(calculator)

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

