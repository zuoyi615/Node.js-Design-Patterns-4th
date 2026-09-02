import { Transform, type TransformCallback, type TransformOptions } from 'node:stream'

export type Record = {
  type: string
  country: string
  profit: string
}

export class FilterByCountry extends Transform {
  #country: string
  #total: number

  constructor(country: string, options?: TransformOptions) {
    super({ ...(options ?? {}), objectMode: true })
    this.#country = country
    this.#total = 0
  }

  _transform(record: Record, _: string, cb: TransformCallback) {
    if (record.country === this.#country) {
      this.#total += Number.parseFloat(record.profit)
      // this.push(record)
    }

    cb()
  }

  _flush(cb: TransformCallback): void {
    this.push(this.#total.toFixed(2))
    cb()
  }
}
