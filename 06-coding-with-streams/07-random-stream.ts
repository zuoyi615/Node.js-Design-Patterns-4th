import { Readable, type ReadableOptions } from 'node:stream';
import Chance from 'chance'

const chance = new Chance()

export class RandomStream extends Readable {
  #emittedBytes = 0

  constructor(options?: ReadableOptions) {
    super(options)
  }

  _read(size: number) {
    const chunk = chance.string({ length: size })
    // should check result
    // if false, stream has reached the `highWaterMark` limit
    // this is called `backpressure`
    // const result = this.push(chunk, 'utf8')
    this.push(chunk, 'utf8')

    this.#emittedBytes += chunk.length

    if (chance.bool({ likelihood: 5 })) {
      this.push(null)
    }
  }

  get emittedBytes() {
    return this.#emittedBytes
  }
}
