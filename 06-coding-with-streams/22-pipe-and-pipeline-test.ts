import assert from 'node:assert/strict';
import { createWriteStream, createReadStream } from 'node:fs';
import { pipeline, Transform } from 'node:stream';

const streamR = createReadStream('../package.json')
const streamT = new Transform({
  transform(chunk, _, done) {
    this.push(chunk.toString().toUpperCase())
    done()
  },
})

const streamW = createWriteStream('package-uppercase.json')

// const pipelineReturn = pipeline(
//   streamR,
//   streamT,
//   streamW,
//   () => { }
// )

// assert.equal(streamW, pipelineReturn)

const pipeReturn = streamR.pipe(streamT).pipe(streamW)

assert.equal(streamW, pipeReturn)
