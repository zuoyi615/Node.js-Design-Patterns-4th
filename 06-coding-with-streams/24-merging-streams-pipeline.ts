import { createWriteStream, createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { Readable, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const [, , dest, ...sources] = process.argv
const destStream = createWriteStream(dest)

function createAddingLineEnd() {
  return new Transform({
    transform(chunk, _, done) {
      done(null, `${chunk}\n`)
    },
  })
}

try {
  for (const source of sources) {
    const sourceStream = createReadStream(source, { highWaterMark: 16 })
    const lineStream = Readable.from(
      createInterface({
        input: sourceStream,
        terminal: false,
      })

    )

    // await: hold the execution
    await pipeline(
      lineStream,
      createAddingLineEnd(),
      destStream,
      { end: false }
    )

  }
} catch (e) {
  destStream.destroy()
  throw e
}

destStream.end()
console.log(`${dest} created`)

// the content order of files is guaranteed. or we can use `multistream` npm package
// node 24-merging-streams-pipeline.ts <dest> <file1> <file2> <file....>
