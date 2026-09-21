import { Transform, type TransformOptions, type TransformCallback } from 'node:stream'

interface CountCrimesByParamOptions extends TransformOptions {
  param: string
}

type CrimesByParam = Record<string, number>
type Row = Record<string, string>

export class CountCrimesByParam extends Transform {
  #param: string
  #crimesByParam: CrimesByParam

  constructor(options: CountCrimesByParamOptions) {
    const { param, ...rest } = options
    super({
      ...rest,
      objectMode: true,
    })

    this.#param = param
    this.#crimesByParam = {}
  }

  _transform(row: Row, _: string, cb: TransformCallback) {
    if (!row || row.year === 'year') return cb()

    try {
      const paramValue = row[this.#param]

      if (!this.#crimesByParam[paramValue]) this.#crimesByParam[paramValue] = 0
      this.#crimesByParam[paramValue] += Number(row.value)

      cb()
    } catch (e) {
      cb(e as Error)
    }
  }

  _flush(cb: TransformCallback) {
    try {
      // console.log(this.#crimesByParam)
      this.push(Object.entries(this.#crimesByParam))
      cb()
    } catch (e) {
      cb(e as Error)
    }
  }
}
