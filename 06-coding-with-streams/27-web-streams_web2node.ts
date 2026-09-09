import { Readable, Writable, Transform } from 'node:stream'
import { ReadableStream, WritableStream, TransformStream } from 'node:stream/web'

const webReadable = new ReadableStream({
  start(controller) {
    controller.enqueue('Hello, ')
    controller.enqueue('World!\n')
    controller.close()
  },
})

const nodeReadable = Readable.fromWeb(webReadable)
console.log(nodeReadable)

const webWritable = new WritableStream({
  write(chunk) {
    console.log(chunk)
  }
})

const nodeWritable = Writable.fromWeb(webWritable)
console.log(nodeWritable)

const webTransform = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toString().toUpperCase())
  }
})

const nodeTransform = Transform.fromWeb(webTransform)
console.log(nodeTransform)
