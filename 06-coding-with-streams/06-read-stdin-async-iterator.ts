// non-flowing
// use `Ctrl+D` to insert an `EOF`
// cat test.cipher.ts | node 06-

export { }

for await (const chunk of process.stdin) {
  console.log('New data available')
  console.log(`Chunk read (${chunk.length} bytes: ): "${chunk.toString()}"`)
}

console.log('End of stream')
