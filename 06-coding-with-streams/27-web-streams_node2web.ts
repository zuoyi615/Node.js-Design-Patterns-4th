import { Readable, Writable, Transform } from 'node:stream'

const nodeReadable = new Readable({
  read() {
    this.push('Hello, ')
    this.push('World!\n')
    this.push(null)
  }
})

const webReadable = Readable.toWeb(nodeReadable)
console.log(webReadable)

const nodeWritable = new Writable({
  write(chunk, _, done) {
    console.log(chunk.toString())
    done()
  }
})

const webWritable = Writable.toWeb(nodeWritable)
console.log(webWritable)

const nodeTransform = new Transform({
  transform(chunk, _, cb) {
    cb(null, chunk.toString().toUpperCase())
  },
})

const webTransform = Transform.toWeb(nodeTransform)
console.log(webTransform)

nodeReadable.pipe(process.stdout)
webReadable.pipeTo(Writable.toWeb(process.stdout))
