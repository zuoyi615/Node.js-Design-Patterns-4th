import { createBrotliCompress, createGzip, createDeflate } from 'node:zlib'
import { PassThrough, pipeline, type Transform } from 'node:stream'
import { hrtime } from 'node:process'
import { createReadStream, createWriteStream } from 'node:fs'
import { join } from 'node:path'

type Algo = 'Gzip' | 'Brotli' | 'Deflate'

class Profiler {
  #algo: string
  #startTime?: bigint

  constructor(algo: Algo) {
    this.#algo = algo
  }

  start() {
    this.#startTime = hrtime.bigint()
  }

  end(size: number) {
    if (this.#startTime == null) return null

    const endTime = hrtime.bigint()
    const diff = endTime - this.#startTime

    console.log(`${this.#algo} took ${diff / BigInt(1000000)} ms, Total byte size is ${size}`)

    return diff
  }
}

function compressBy(algo: Algo, filePath: string) {
  let label: string
  let createCompressStream: () => Transform

  switch (algo) {
    case 'Gzip':
      [label, createCompressStream] = ['Gzip', createGzip]
      break
    case 'Brotli':
      [label, createCompressStream] = ['Brotli', createBrotliCompress]
      break
    case 'Deflate':
      [label, createCompressStream] = ['Deflate', createDeflate]
      break
    default:
      throw new Error('Invalid algorithm')
  }

  const readableStream = createReadStream(filePath)
  const compressStream = createCompressStream()
  const writeStream = createWriteStream(join(`${filePath}.${algo}.gz`))

  const profiler = new Profiler(algo)
  let size = 0
  const passThrough = new PassThrough()
  passThrough.on('data', chunk => {
    size += chunk.length
  })

  profiler.start()
  pipeline(readableStream, compressStream, passThrough, writeStream, err => {
    if (err) throw err
    profiler.end(size)
  })
}

const filePath = process.argv[2]

compressBy('Gzip', filePath)

compressBy('Brotli', filePath)

compressBy('Deflate', filePath)
