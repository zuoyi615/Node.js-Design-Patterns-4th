import { EventEmitter } from 'node:events'
import { readFile } from 'node:fs'
import { URL } from 'node:url'

class FindRegex extends EventEmitter {
  #regexp: RegExp
  #files: URL[]

  constructor(regexp: RegExp) {
    super()
    this.#regexp = regexp
    this.#files = []
  }

  addFile(file: URL) {
    this.#files.push(file)
    return this
  }

  find() {
    setImmediate(() => this.emit('start', this.#files))

    for (const file of this.#files) {
      readFile(file, 'utf8', (err, content) => {
        if (err) return this.emit('error', err)

        this.emit('fileread', file)

        const match = content.match(this.#regexp)
        if (match) {
          for (const elem of match) {
            this.emit('found', file, elem)
          }
        }
      })
    }

    return this
  }
}

const finder = new FindRegex(/hello [\w.]+/)

finder
  .on('start', files => console.log('Start find(): ', files))
  .on('found', (file, match) => console.log(`Matched "${match}" in file ${file}`))
  .on('fireread', file => console.log(`Read file: ${file}`))
  .on('error', err => console.error(`Error emitted ${err.message}`))

finder
  .addFile(new URL('file-A.txt', import.meta.url))
  .addFile(new URL('file-B.json', import.meta.url))
  .find()

