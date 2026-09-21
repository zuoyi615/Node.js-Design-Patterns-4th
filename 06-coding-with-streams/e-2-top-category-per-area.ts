import { Transform, type TransformOptions, type TransformCallback } from 'node:stream';

type Row = Record<string, string>

export class TopCategoryPerArea extends Transform {
  #countCategoriesByArea: Record<string, Record<string, number>>

  constructor(options?: TransformOptions) {
    super({ ...(options ?? {}), objectMode: true })
    this.#countCategoriesByArea = {}
  }

  _transform(row: Row, _: BufferEncoding, cb: TransformCallback) {
    if (!row || row.year === 'year') return cb()
    try {
      const area = this.#countCategoriesByArea[row.borough]
      const { major_category, value } = row

      if (area) {
        const { major_category } = row
        if (!area[major_category]) area[major_category] = 0
        area[major_category] += Number(value)
      } else {
        this.#countCategoriesByArea[row.borough] = {
          [major_category]: Number(value)
        }
      }
      cb()
    } catch (e) {
      cb(e as Error)
    }
  }

  _flush(cb: TransformCallback) {
    try {
      const res = Object.entries(this.#countCategoriesByArea).map(([key, value]) => {
        const maxVal = Object.entries(value).sort(([, a], [, b]) => b - a)[0];
        return [`${key}, ${maxVal[0]}`, maxVal[1]]
      })
      cb(null, res)

      // this.push(res)
      // cb()
    } catch (e) {
      cb(e as Error)
    }
  }
}
