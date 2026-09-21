import { Transform, type TransformOptions, type TransformCallback } from 'node:stream'

interface CountCrimesByParamOptions extends TransformOptions {
  sortDirection?: 'desc' | 'asc'
  limit?: number
}

type CrimesByParamItem = [string, number]

export class SortAndLimit extends Transform {
  #sortDirection: 'desc' | 'asc'
  #limit?: number

  constructor(options: CountCrimesByParamOptions) {
    const { limit, sortDirection, ...rest } = options
    super({
      ...rest,
      objectMode: true,
    })

    this.#limit = limit
    this.#sortDirection = sortDirection ?? 'desc'
  }

  _transform(list: CrimesByParamItem[], _: string, cb: TransformCallback) {
    try {
      list.sort((a, b) => this.#sortDirection === 'desc' ? b[1] - a[1] : a[1] - b[1])
      const result = this.#limit ? list.slice(0, this.#limit) : list
      cb(null, result)
      // this.push(result)
      // cb()
    } catch (e) {
      cb(e as Error)
    }
  }
}
