import { readdir, readFile } from 'node:fs'
import { join } from 'node:path'

type State = {
  finished: boolean
  list: string[]
  counter: number
}

type Callback = (err: Error | null, list: string[] | null) => void

export function recursiveFind(dir: string, keyword: string, cb: Callback) {
  if (!keyword) return cb(new Error('<keyword> should not be empty'), null)

  const state: State = {
    counter: 1,
    finished: false,
    list: []
  }

  visit(dir, keyword)

  function visit(dir: string, keyword: string) {
    readdir(dir, (err, files) => {
      if (err) {
        if (err.code !== 'ENOTDIR') return done(err, null)
        return searchInFile(dir, keyword)
      }

      for (const file of files) {
        state.counter++
        const filePath = join(dir, file)
        visit(filePath, keyword)
      }

      checkCounter()
    })
  }

  function searchInFile(file: string, keyword: string) {
    readFile(file, (err, content) => {
      if (err) return done(err, null)

      if (content.toString('utf8').includes(keyword)) {
        state.list.push(file)
      }

      checkCounter()
    })
  }

  function done(err: Error | null, list: string[] | null) {
    if (state.finished) return
    state.finished = true
    cb(err, list)
  }

  function checkCounter() {
    state.counter--

    process.nextTick(() => {
      if (!state.counter) {
        done(null, state.list)
      }
    })
  }
}

recursiveFind(import.meta.dirname, 'Jon', (err, list) => {
  if (err) {
    return console.log(err)
  }

  console.log({
    list,
  })
})
