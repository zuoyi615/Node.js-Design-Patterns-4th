import { Transform, type TransformOptions, type TransformCallback } from 'node:stream'

interface CountCrimesByParamOptions extends TransformOptions {
  label: string
}

type CrimesByParamItem = [string, number]

export class ResultToString extends Transform {
  #label: string

  constructor(options: CountCrimesByParamOptions) {
    const { label, ...rest } = options
    super({
      ...rest,
      objectMode: true,
    })

    this.#label = label
  }

  _transform(list: CrimesByParamItem[], _: string, cb: TransformCallback) {
    let text = `\n${this.#label}\n`
    for (const item of list) {
      text = text + `${item[0]}\t${item[1]}\n`
    }
    cb(null, text)
  }
}
