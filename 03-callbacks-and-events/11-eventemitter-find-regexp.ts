import EventEmitter from "node:events";
import { readFile } from "node:fs";
import { URL } from "node:url";

function findRegexp(files: URL[], regexp: RegExp) {
  const emitter = new EventEmitter()

  for (const file of files) {
    readFile(file, 'utf8', (err, content) => {
      if (err) {
        return emitter.emit('error', err)
      }

      emitter.emit('filteread', file)

      const match = content.match(regexp)

      if (match) {
        for (const elem of match) {
          emitter.emit('found', file, elem)
        }
      }
    })
  }

  return emitter
}

console.log(import.meta.url)

const files = [
  new URL('file-A.txt', import.meta.url),
  new URL('file-B.json', import.meta.url),
]

findRegexp(files, /hello [\w.]+/)
  .on('fileread', file => console.log(`${file} was read`))
  .on('found', (file, match) => console.log(`Matched "${match}" in ${file}`))
  .on('error', err => console.error(`Error emitted ${err.message}`))
