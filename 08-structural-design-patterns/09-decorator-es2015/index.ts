import { StackCalculator } from './stack-calculator.ts'

function patchCalculator(calculator: StackCalculator) {
  // @ts-ignore
  calculator.add = () => {
    const addend2 = calculator.peekValue()
    const addend1 = calculator.peekValue()
    const result = addend1 + addend2
    calculator.putValue(result)
    return result
  }

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
const enhancedCalculator = new Proxy(calculator, {
  get(target, property) {
    if (property === 'add') {
      return function add() {
        const addend2 = target.peekValue()
        const addend1 = target.peekValue()
        const result = addend1 + addend2
        target.putValue(result)
        return result
      }
    }

    if (property === 'divide') {
      return () => {

        const divisor = target.peekValue()

        if (divisor === 0) {
          throw new Error('Division by 0')
        }

        return target.divide()
      }
    }

    // @ts-ignore
    return target[property]
  }
})
enhancedCalculator.putValue(4)
enhancedCalculator.putValue(3)
// @ts-ignore
console.log(enhancedCalculator.add()) // 4+3 = 7
enhancedCalculator.putValue(2)
console.log(enhancedCalculator.multiply()) // 7*2 = 14
// enhancedCalculator.putValue(0)
// console.log(enhancedCalculator.divide()) // 14/0 -> Error('Division by 0')
