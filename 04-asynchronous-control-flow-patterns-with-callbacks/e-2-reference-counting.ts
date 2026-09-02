import { readdir } from 'node:fs'
import { join } from 'node:path'

type State = {
  finished: boolean
  list: string[]
  running: number
}

type Callback = (err: Error | null, list: string[] | null) => void

export function listNestedFiles(dir: string, cb: Callback) {
  const state: State = {
    finished: false,
    list: [],
    running: 1, // Starting from 1, dir is root, at list one time
  }

  function done(err: Error | null, files: string[] | null) {
    if (state.finished) return
    state.finished = true
    cb(err, files)
  }

  function visit(dir: string) {
    readdir(dir, (err, files) => {
      if (err) {
        const { code } = err
        if (code !== 'ENOTDIR') return done(err, null)
        state.list.push(dir)
      } else {
        for (const file of files) {
          const filePath = join(dir, file)
          state.running++
          // console.log({ running: state.running, path: filePath, operation: '++1' })
          visit(filePath)
        }
      }

      state.running--
      // console.log({ running: state.running, path: dir, operation: '--1' })

      process.nextTick(() => {
        if (!state.running) return done(null, state.list)
      })
    })
  }

  visit(dir)
}

listNestedFiles('/home/zuoyi/git/Node.js_design_patterns/03-callbacks-and-events', (err, list) => {
  if (err) {
    console.log(err)
    return
  }

  console.log({
    list
  })
})
