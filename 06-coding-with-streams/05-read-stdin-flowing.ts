// non-flowing
// use `Ctrl+D` to insert an `EOF`
// cat test.cipher.ts | node 05-read-stdin.ts
// data pushed by internal event
process
  .stdin
  .on('data', chunk => {
    console.log('New data available')
    console.log(`Chunk read (${chunk.length} bytes): "${chunk.toString().replace('\n', '')}"`)
  })
  .on('end', () => console.log('End of stream'))

export { }
