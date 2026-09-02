import { Transform, type TransformCallback, type TransformOptions } from 'node:stream';
import { type Record } from './13-filter-by-country.ts';

/**
 * NOTE: Pattern: Streaming aggregation
 * Use `_transform` to process the data and accumulate the partial result
 * then call `this.push()` only in the `_flush()` method to emit the final result when all the data has been processed.
 */

export class SumProfit extends Transform {
  #total: number

  constructor(options?: TransformOptions) {
    super({ ...(options ?? {}), objectMode: true })
    this.#total = 0
  }

  _transform(record: Record, _: string, cb: TransformCallback) {
    this.#total += Number.parseFloat(record.profit)
    cb() // to indicate that the current record has been processed and the stream is ready to receive another one.
  }

  _flush(cb: TransformCallback) {
    this.push(this.#total.toString())
    cb()
  }
}
