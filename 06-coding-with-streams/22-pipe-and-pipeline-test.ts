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

const pipelineReturn = pipeline(
  streamR,
  streamT,
  streamW,
  () => { }
)

// console.log(streamW === pipelineReturn) // true
assert.equal(streamW, pipelineReturn)

const pipeReturn = streamR.pipe(streamT).pipe(streamW)

// console.log(streamW === pipeReturn) // true
assert.equal(streamW, pipeReturn)
