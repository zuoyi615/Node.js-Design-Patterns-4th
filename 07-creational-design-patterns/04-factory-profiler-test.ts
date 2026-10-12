import { createProfiler } from './04-factory-profiler.ts'

function getAllFactors(n: number) {
  let intNumber = n
  const profiler = createProfiler(`Finding all factors of ${intNumber}`)

  profiler.start()

  const factors: number[] = []

  for (let factor = 2; factor <= intNumber; factor++) {
    while (intNumber % factor === 0) {
      factors.push(factor)
      intNumber /= factor
    }
  }

  profiler.end()

  return factors
}

const n = Number.parseInt(process.argv[2])
const factors = getAllFactors(n)

console.log({
  n,
  factors,
})

