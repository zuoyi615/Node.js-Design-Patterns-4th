import { Transform, type TransformCallback, type TransformOptions } from 'node:stream'

export type Record = {
  type: string
  country: string
  profit: string
}

export class FilterByCountry extends Transform {
  #country: string

  constructor(country: string, options?: TransformOptions) {
    super({ ...(options ?? {}), objectMode: true })
    this.#country = country
  }

  _transform(record: Record, _: string, cb: TransformCallback) {
    if (record.country === this.#country) {
      this.push(record)
    }

    cb()
  }
}
