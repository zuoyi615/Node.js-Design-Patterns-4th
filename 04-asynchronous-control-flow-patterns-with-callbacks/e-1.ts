import { readFile, writeFile } from 'node:fs'
import { join } from 'node:path'

type Callback = (err: Error | null, success: boolean) => void

function concatFiles(dest: string, cb: Callback, ...files: string[]) {
  let index = 0
  const initialContent = ''
  const length = files.length

  function next(err: Error | null, content: string) {
    if (err) return cb(err, false)

    if (index === length) {
      return writeFile(dest, content, err => {
        if (err) return cb(err, false)
        return cb(null, true)
      })
    }

    const file = files[index++]

    readFile(file, 'utf8', (err, data) => {
      next(err, content.replace('\n', '') + data)
    })
  }

  next(null, initialContent)
}

const fileNames = [
  'file-e-1_01.txt',
  'file-e-1_02.txt',
  'file-e-1_03.txt',
  'file-e-1_04.txt',
  'file-e-1_05.txt',
  'file-e-1_06.txt',
]

const dirname = import.meta.dirname
const files = fileNames.map(name => join(dirname, name))
const resultFile = join(dirname, 'file-e-1_result.txt')

concatFiles(
  resultFile,
  (err, success) => {
    if (err) return console.error(err)
    console.log(success)
  },
  ...files,
)
