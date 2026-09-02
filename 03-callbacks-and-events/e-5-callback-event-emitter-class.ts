import { EventEmitter } from "node:events";
import { readdir, stat } from 'node:fs'

type FileItem = {
  path: string
  size: number
}

class LargestFileFinder extends EventEmitter {
  constructor() {
    super()
  }

  scan(dir: string, callback: (err: Error | null, largest: FileItem | null) => void) {
    this.emit('start', dir)

    this.#find(dir, (err, largest) => {
      if (err) {
        this.emit('error', err)
        return callback(err, null)
      }

      this.emit('end', largest)
      callback(null, largest)
    })
  }

  #find(dir: string, callback: (err: Error | null, largest: FileItem | null) => void) {
    readdir(dir, (err, files) => {
      if (err) return callback(err, null)

      let pending = files.length
      if (pending === 0) return callback(null, null)

      let largest: FileItem | null = null
      let isFinished = false

      function done(err: Error | null, file: FileItem | null) {
        if (isFinished) return

        if (err) {
          isFinished = true
          return callback(err, null)
        }

        if (file) {
          if (!largest || file.size > largest.size) {
            largest = file
          }
        }

        pending--

        if (pending === 0) {
          isFinished = true
          callback(null, largest)
        }
      }

      files.forEach(file => {
        const filePath = `${dir}/${file}`
        stat(filePath, (err, stats) => {
          if (err) return done(err, null)
          if (stats.isFile()) {
            const fileItem = { path: filePath, size: stats.size }
            this.emit('file', fileItem)
            return done(null, fileItem)
          }
          if (stats.isDirectory()) {
            this.emit('dir', filePath)
            return this.#find(filePath, done) // done as callback of next level directory
          }
          done(null, null)
        })
      })
    })
  }
}

const finder = new LargestFileFinder()

finder
  .on('start', () => { })
  .on('end', () => { })
  .on('file', () => { })
  .on('dir', () => { })
  .on('error', () => { })

finder.scan(import.meta.dirname, (err, largest) => {
  if (err) {
    console.log(err)
    return
  }

  console.log(`Found the largest file: `, largest)
})
