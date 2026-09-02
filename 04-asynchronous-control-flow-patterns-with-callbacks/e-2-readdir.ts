import { readdir, stat } from 'node:fs';
import { join } from 'node:path'

function listNestedFiles(dir: string, cb: (err: Error | null, list: string[]) => void) {
  const list: string[] = []

  readdir(dir, { recursive: true }, (err, files) => {
    if (err) return cb(err, [])

    let isFinished = false
    let pending = files.length

    if (pending === 0) {
      isFinished = true
      return cb(null, [])
    }

    files.forEach(file => {
      if (isFinished) return

      const filePath = join(dir, file as string)
      stat(filePath, (err, stats) => {
        if (err) {
          isFinished = true
          return cb(err, [])
        }


        if (stats.isFile()) {
          list.push(filePath)
        }

        pending--
        if (pending === 0) {
          isFinished = true
          return cb(null, list)
        }
      })
    })
  })
}

listNestedFiles(import.meta.dirname, (err, list) => {
  if (err) {
    return console.log(err)
  }

  console.log(list)
  console.log(list.length)
})
