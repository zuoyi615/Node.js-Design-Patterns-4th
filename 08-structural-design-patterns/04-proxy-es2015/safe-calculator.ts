import { StackCalculator } from './stack-calculator.ts'

const calculator = new StackCalculator()

type Property = 'stack' | 'clear' | 'getValue' | 'peekValue' | 'putValue' | 'multiply' | 'divide'

const safeCalculator = new Proxy(calculator, {
  get: (target, property: Property) => {
    if (property === 'divide') {
      return () => {
        const divisor = target.peekValue()
        if (divisor === 0) {
          throw new Error('Division by 0')
        }

        return target.divide()
      }
    }

    return target[property]
  }
})

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

