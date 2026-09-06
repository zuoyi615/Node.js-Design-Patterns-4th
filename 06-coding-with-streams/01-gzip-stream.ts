import { createReadStream, createWriteStream } from 'node:fs'
import { createGzip } from 'node:zlib'

const filename = process.argv[2]

createReadStream(filename)
  .on('error', console.error)
  .pipe(createGzip())
  .on('error', console.error)
  .pipe(createWriteStream(`${filename}.gz`))
  .on('finish', console.log.bind(null, 'File successfully compressed.'))
  .on('error', console.error)

