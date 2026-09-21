import { createBrotliCompress, createGzip, createDeflate } from 'node:zlib'
import { PassThrough, pipeline, type Transform } from 'node:stream'
import { hrtime } from 'node:process'
import { createReadStream, createWriteStream } from 'node:fs'
import { join } from 'node:path'

type Algo = 'Gzip' | 'Brotli' | 'Deflate'

function compressBy(algo: Algo, filename: string) {
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

  const readableStream = createReadStream(filename)
  const compressStream = createCompressStream()
  const writeStream = createWriteStream(join(`${filename}.${algo}.gz`))

  let size = 0
  const passThrough = new PassThrough()
  passThrough.on('data', chunk => {
    size += chunk.length
  })

  const startedAt = hrtime.bigint()
  pipeline(readableStream, compressStream, passThrough, writeStream, err => {
    if (err) throw err
    const diff = hrtime.bigint() - startedAt
    console.log(`${algo} took ${diff / BigInt(1000000)} ms, Total byte size is ${size}`)
  })
}

const filename = process.argv[2]

compressBy('Gzip', filename)

compressBy('Brotli', filename)

compressBy('Deflate', filename)
