class Profiler {
  #label: string
  #lastTime?: bigint

  constructor(label: string) {
    this.#label = label
  }

  start() {
    this.#lastTime = process.hrtime.bigint()
  }

  end() {
    const diff = process.hrtime.bigint() - this.#lastTime!
    console.log(`Timer "${this.#label}" took ${diff / BigInt(1000000)} ms `)
  }
}

const noobProfiler = {
  start() { },
  end() { },
}

export function createProfiler(label: string) {
  if (process.env.NODE_ENV === 'production') {
    return noobProfiler
  }

  return new Profiler(label)
}

//  NODE_ENV=production node 04-factory-profiler-test.ts 1000
//  node 04-factory-profiler-test.ts 1000
