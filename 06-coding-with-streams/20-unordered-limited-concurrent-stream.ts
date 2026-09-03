import { Transform, type Readable, type TransformOptions, type TransformCallback } from 'node:stream'

type Push = Readable['push']
export type CustomTransform = (data: any, enc: string, push: Push, done: TransformCallback) => void

export class LimitedUnorderedConcurrentStream extends Transform {
  #customTransform: CustomTransform
  #running: number = 0
  #terminalCallback: TransformCallback | null = null
  #continueCallback: TransformCallback | null = null
  #concurrency: number = 2

  constructor(
    concurrency: number,
    customTransform: CustomTransform,
    options?: TransformOptions,
  ) {
    super({ objectMode: true, ...(options ?? {}) })
    this.#customTransform = customTransform
    this.#running = 0
    this.#concurrency = concurrency
    this.#terminalCallback = null
    this.#continueCallback = null
  }

  _transform(chunk: any, enc: string, done: TransformCallback) {
    this.#running++

    try {
      this.#customTransform(
        chunk,
        enc,
        this.push.bind(this),
        this.#onComplete.bind(this)
      )
    } catch (err) {
      this.#onComplete(err as Error)
    } finally {
      if (this.#running < this.#concurrency) {
        return done()
      }

      this.#continueCallback = done
    }
  }

  _final(done: TransformCallback) {
    if (this.#running > 0) return this.#terminalCallback = done
    done()
  }

  #onComplete(err?: Error | null) {
    this.#running--

    if (err) {
      this.emit('error', err)
      this.destroy(err)
      return
    }

    // next chunk
    const tmp = this.#continueCallback
    this.#continueCallback = null
    tmp?.()

    if (this.#running === 0) this.#terminalCallback?.()
  }
}
