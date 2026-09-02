import { readdir, stat } from 'node:fs';
import { join } from 'node:path'

function listNestedFiles(dir: string, cb: (err: Error | null, list: string[]) => void) {
  const list: string[] = []

  function iterate(dir: string, cb: (err: Error | null, files: string[]) => void) {
    readdir(dir, (err, files) => {
      if (err) return cb(err, [])

      let pending = files.length
      if (pending === 0) return cb(null, [])
      let isFinished = false

      function done(err: Error | null) {
        if (isFinished) return

        if (err) {
          isFinished = true
          return cb(err, [])
        }

        pending--

        if (pending === 0) {
          isFinished = true
          cb(null, list)
        }
      }

      files.forEach(file => {
        const filePath = join(dir, file)
        stat(filePath, (err, stats) => {
          if (err) return done(err)

          if (stats.isFile()) {
            list.push(filePath)
            return done(null)
          }

          if (stats.isDirectory()) return iterate(filePath, done)

          done(null)
        })
      })
    })
  }

  iterate(dir, cb)
}

listNestedFiles(import.meta.dirname, (err, list) => {
  if (err) {
    return console.log(err)
  }

  console.log(list)
})
