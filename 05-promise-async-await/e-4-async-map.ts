type Callback = (promise: Promise<unknown>, index: number, list: Promise<unknown>[]) => unknown

export async function asyncMap(list: Promise<unknown>[], cb: Callback, concurrency = 2) {
  const { length: total } = list
  const results = new Array(total)
  let index = 0

  async function worker() {
    while (index < total) {
      const currentIndex = index++
      const promise = list[currentIndex]

      try {
        results[currentIndex] = await cb(promise, currentIndex, list)
      } catch (error) {
        throw error
      }
    }
  }

  const workers: Promise<unknown>[] = []

  const activeLimit = Math.min(concurrency, total)
  for (let i = 0; i < activeLimit; i++) {
    workers.push(worker())
  }

  await Promise.all(workers)

  return results
}

function delay(millisecends: number) {
  return new Promise(resolve => {
    setTimeout(() => resolve(millisecends), millisecends)
  })
}

const results = await asyncMap(
  [
    delay(50),
    delay(100),
    delay(150),
    delay(200),
    delay(250),
    delay(300),
    delay(400),
  ],
  async (item) => {
    const result = await item as unknown as number
    return result * 2
  },
  2
)

console.log(results)
