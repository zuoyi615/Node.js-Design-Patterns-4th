import { ImmutableBuffer } from './07-revealing-constructor-immutable-buffer.ts'

const hello = 'Hello'
const immutable = new ImmutableBuffer(hello.length, ({ write }) => {
  write(hello)
})

// TypeError:
// immutable.write('Hello?')

// @ts-ignore
console.log(String.fromCharCode(immutable.readInt8(0)))
