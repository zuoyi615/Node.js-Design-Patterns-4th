// one of interesting Proxy capabilities
const evenNumbers = new Proxy([], {
  get: (_target, index: string) => Number(index) * 2,

  // `has` trap intercepts the usage of the `in` operator
  has: (_target, index: string) => Number(index) % 2 === 0,
})

console.log(2 in evenNumbers) // true
console.log(5 in evenNumbers) // false
console.log(evenNumbers[7]) // 14
