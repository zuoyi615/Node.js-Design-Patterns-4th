import { createWriteStream, createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { Readable, Transform } from 'node:stream';

const [, , dest, ...sources] = process.argv

let endCount = 0
const destStream = createWriteStream(dest)

function createAddingLineEnd() {
  return new Transform({
    transform(chunk, _, done) {
      done(null, `${chunk}\n`)
    },
  })
}

for (const source of sources) {
  const sourceStream = createReadStream(source, { highWaterMark: 16 })
  const lineStream = Readable.from(
    createInterface({
      input: sourceStream,
      terminal: false,
    })

  )
  const addLineEnd = createAddingLineEnd()
  lineStream.on('end', () => {
    if (++endCount === sources.length) {
      destStream.end()
      console.log(`${dest} created`)
    }
  })

  lineStream
    .pipe(addLineEnd)
    .pipe(destStream, { end: false })
}

// node 24-merging-streams <dest> <file1> <file2> <file....>
