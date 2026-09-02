// non-flowing
// use `Ctrl+D` to insert an `EOF`
// cat test.cipher.ts | node 04-read-stdin.ts
// data pulled by consumer
process
  .stdin
  .on('readable', () => {
    let chunk: Buffer
    console.log('New data available')
    while ((chunk = process.stdin.read()) !== null) {
      console.log(`Chunk read (${chunk.length} bytes): "${chunk.toString().replace('\n', '')}"`)
    }
  })
  .on('end', () => console.log('End of stream'))

export { }
