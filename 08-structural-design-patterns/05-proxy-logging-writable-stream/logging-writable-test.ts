import { createWriteStream } from 'node:fs'
import { createLoggingWritable } from './logging-writable.ts'

const writable = createWriteStream('test.txt')
const writableProxy = createLoggingWritable(writable)

writableProxy.write('First Chunk\n')
writableProxy.write('Second Chunk\n')
writable.write('This is not logged\n')
writableProxy.end()
