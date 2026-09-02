import { Readable } from 'node:stream'

/**
 * INFO: iterable:
 *    1. array
 *    2. generator
 *    3. iterators
 *    4. async iterators
 */

type Mountain = {
  name: string
  height: number
}
const mountains = [
  { name: 'Everest', height: 8848 },
  { name: 'K2', height: 8611 },
  { name: 'Kangchenjunga', height: 8586 },
  { name: 'Lhotse', height: 8516 },
  { name: 'Makalu', height: 8481 },
]

const mountainsStream = Readable.from(mountains, { objectMode: true }) // default is true

mountainsStream.on('data', (mountain: Mountain) => {
  console.log(`${mountain.name.padStart(14)}\t${mountain.height}m`)
})
