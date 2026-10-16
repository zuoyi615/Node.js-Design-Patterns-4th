export class StackCalculator {
  #stack: number[]

  constructor() {
    this.#stack = []
  }

  getValue() {
    return this.#stack.pop()
  }

  putValue(value: number) {
    this.#stack.push(value)
  }

  peekValue() {
    return this.#stack[this.#stack.length - 1]
  }

  clear() {
    this.#stack = []
  }

  divide() {
    const divisor = this.getValue()
    const dividend = this.getValue()
    if (dividend != null && divisor != null) {
      const result = dividend / divisor
      this.putValue(result)
      return result
    }

    throw new Error('divisor or dividend is null')
  }

  multiply() {
    const multiplicand = this.getValue()
    const multiplier = this.getValue()

    if (multiplicand != null && multiplier != null) {
      const result = multiplier * multiplicand
      this.putValue(result)
      return result
    }

    throw new Error('multiplicand or multiplier is null')
  }
}
