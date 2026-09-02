import { EventEmitter } from 'node:events'
import { readdir, stat } from 'node:fs'

type FileItem = {
  path: string
  size: number
}

class LargestFileFinder extends EventEmitter {
  constructor() {
    super()
  }

  scan(dir: string, callback: (err: Error | null, result: FileItem | null) => void) {
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

  #find(dir: string, callback: (err: Error | null, result: FileItem | null) => void) {
    readdir(dir, (err, files) => {
      if (err) return callback(err, null)

      let pending = files.length
      if (pending === 0) return callback(null, null)

      let largest: FileItem | null = null
      let isFinished = false

      function done(err: Error | null, result: FileItem | null) {
        if (isFinished) return

        if (err) {
          isFinished = true
          return callback(err, null)
        }

        if (result) {
          if (!largest || result.size > largest.size) {
            largest = result
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
            const fileInfo: FileItem = {
              path: filePath,
              size: stats.size,
            }

            this.emit('file', fileInfo)
            return done(null, fileInfo)
          }

          if (stats.isDirectory()) {
            this.emit('directory', filePath)
            return this.#find(filePath, done)
          }

          done(null, null)
        })
      })
    })
  }
}

const finder = new LargestFileFinder()

finder
  .on('start', (dir: string) => {
    console.log(`Start Scanning: ${dir}`);
  })
  // .on('file', (file: FileItem) => {
  //   console.log(`File: ${file.path} (${file.size} bytes)`);
  // })
  // .on('directory', dir => {
  //   console.log(`Directory: ${dir}`);
  // })
  .on('end', (largest: FileItem | null) => {
    console.log('Scan completed');
    if (largest) {
      console.log(`Largest file: ${largest.path}`);
      console.log(`Size: ${largest.size} bytes`);
    }
  })

finder.scan('/Volumes/CodeAsDev/Notes', (err, largest) => {
  if (err) return
  console.log('Callback result:', largest);
})
