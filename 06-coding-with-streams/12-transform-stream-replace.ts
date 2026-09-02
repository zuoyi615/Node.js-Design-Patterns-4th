import { Transform, type TransformOptions } from 'node:stream';

type Callback = (err?: Error | null) => void

export class ReplaceStream extends Transform {
  #searchStr: string
  #replaceStr: string
  #tail: string

  constructor(searchStr: string, replaceStr: string, options?: TransformOptions) {
    super(options)
    this.#searchStr = searchStr
    this.#replaceStr = replaceStr
    this.#tail = ''
  }

  _transform(chunk: string, _: string, cb: Callback) {
    const pieces = (this.#tail + chunk).split(this.#searchStr)
    const lastPiece = pieces[pieces.length - 1]
    const tailLen = this.#searchStr.length - 1
    this.#tail = lastPiece.slice(-tailLen)
    pieces[pieces.length - 1] = lastPiece.slice(0, -tailLen)
    this.push(pieces.join(this.#replaceStr))

    cb()
  }

  _flush(cb: Callback) {
    this.push(this.#tail)
    cb()
  }
}
