import { RandomStream } from './07-random-stream.ts';

const randomStream = new RandomStream({
  highWaterMark: 12,
})

randomStream
  .on('data', chunk => {
    console.log(`Chunk received (${chunk.length} bytes): ${chunk.toString()}`)
  })
  .on('end', () => {
    console.log(`Produced ${randomStream.emittedBytes} bytes of random data`)
  })
