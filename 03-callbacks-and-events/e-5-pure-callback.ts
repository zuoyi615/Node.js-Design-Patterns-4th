import { readdir, stat } from 'node:fs'

type FileItem = {
  path: string
  size: number
}

function findLargestFile(dir: string, callback: (err: Error | null, largest: FileItem | null) => void) {
  function find(dir: string, callback: (err: Error | null, largest: FileItem | null) => void) {
    readdir(dir, (err, files) => {
      if (err) return callback(err, null)

      let pending = files.length
      if (pending === 0) return callback(null, null)

      let larget: FileItem | null = null
      let isFinished = false

      function done(err: Error | null, file: FileItem | null) {
        if (isFinished) return

        if (err) {
          isFinished = true
          return callback(err, null)
        }

        if (file) {
          if (!larget || file.size > larget.size) {
            larget = file
          }
        }

        pending--

        if (pending === 0) {
          isFinished = true
          return callback(null, larget)
        }
      }

      files.forEach(file => {
        const filePath = `${dir}/${file}`
        stat(filePath, (err, stats) => {
          if (err) return done(err, null)
          if (stats.isFile()) {
            const fileItem = { path: filePath, size: stats.size }
            return done(null, fileItem)
          }
          if (stats.isDirectory()) {
            return find(filePath, done)
          }
          return done(null, null)
        })
      })
    })
  }

  find(dir, (err, largest) => {
    if (err) return callback(err, null)
    return callback(null, largest)
  })
}

findLargestFile(import.meta.dirname, (err, largest) => {
  if (err) {
    console.log(err.message)
    return
  }

  console.log('Found the largest file: ', largest)
})
