import { createReadStream } from 'node:fs'
import { basename } from 'node:path'
import { pipeline } from 'node:stream'
import { createBrotliCompress } from 'node:zlib'
import { createUploadStream } from './15-02-passthrough-late-piping_upload.ts'

const filepath = process.argv[2]
const filename = basename(filepath)

pipeline(
  createReadStream(filepath),
  createBrotliCompress(),
  createUploadStream(`${filename}.br`),
  err => {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    console.log('File uploaded')
  }
)

/**
 * NOTE: Pattern
 * Use a `PassThrough` stream when you need to provide a placeholder
 * for data that will be read or written in the future
 */
