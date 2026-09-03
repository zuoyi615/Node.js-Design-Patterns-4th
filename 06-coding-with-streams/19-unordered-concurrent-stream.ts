import { Transform, type Readable, type TransformOptions, type TransformCallback } from 'node:stream'

type Push = Readable['push']
export type CustomTransform = (data: any, enc: string, push: Push, done: TransformCallback) => void

export class UnorderedConcurrentStream extends Transform {
  #customTransform: CustomTransform
  #running: number = 0
  #terminalCallback: TransformCallback | null = null

  constructor(customTransform: CustomTransform, options?: TransformOptions) {
    super({ objectMode: true, ...(options ?? {}) })
    this.#customTransform = customTransform
    this.#running = 0
    this.#terminalCallback = null
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
      done()
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

    if (this.#running === 0) this.#terminalCallback?.()
  }
}
