function map(array: number[], cb: (n: number) => number) {
  const result: number[] = []
  for (const item of array) {
    result.push(cb(item))
  }

  return result
}

console.log('before')

const result = map([1, 2, 3], n => {
  console.log(n)
  return n ** 2
})

console.log(result)

console.log('after')

// before
// 1
// 2
// 3
// [1, 4, 9]
// after
