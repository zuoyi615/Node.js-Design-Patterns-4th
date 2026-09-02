import { createReadStream } from 'node:fs'
import { basename } from 'node:path'
import { PassThrough } from 'node:stream'
import { createBrotliCompress } from 'node:zlib'
import { upload } from './15-01-passthrough-late-piping_upload.ts'

const filepath = process.argv[2]
const filename = basename(filepath)
const contentStream = new PassThrough()

upload(`${filename}.br`, contentStream).then(
  res => {
    console.log(`Server Resonse: ${res.data}`)
  },
  err => {
    console.error(err)
    process.exit(1)
  },
)

createReadStream(filepath)
  .pipe(createBrotliCompress())
  .pipe(contentStream)

/**
 * NOTE: Pattern
 * Use a `PassThrough` stream when you need to provide a placeholder
 * for data that will be read or written in the future
 */
