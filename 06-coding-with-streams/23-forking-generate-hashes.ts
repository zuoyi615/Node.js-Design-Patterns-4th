import { createHash } from 'node:crypto'
import { createReadStream, createWriteStream } from 'node:fs'

// node 23-forking-generate-hashes <filename>
const [, , filename] = process.argv
const sha1Stream = createHash('sha1').setEncoding('hex')
const md5Stream = createHash('md5').setEncoding('hex')
const inputStream = createReadStream(filename)

inputStream.pipe(sha1Stream).pipe(createWriteStream(`${filename}.sha1`))

inputStream.pipe(md5Stream).pipe(createWriteStream(`${filename}.md5`))

/**
 * INFO: Forking stream
 *    1. Both `sha1Stream` and `md5Stream` will be end automatically when `inputStream` ends
 *    2. The two forks of the stream will receive a reference to the same data
 *    3. Backpressure will work out of box, the flow coming from `inputStream` will go as fast as the lowest branch of the fork
 *    4. If we pipe to an additional stream after we've started consuming the data at sourse, the new stream will only receive new chunks of data
 */

