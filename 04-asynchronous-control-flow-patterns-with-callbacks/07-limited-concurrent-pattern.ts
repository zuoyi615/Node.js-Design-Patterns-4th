import { makeSampleTask } from './mock.ts'

const tasks = [
  makeSampleTask('Task 1'),
  makeSampleTask('Task 2'),
  makeSampleTask('Task 3'),
  makeSampleTask('Task 4'),
  makeSampleTask('Task 5'),
  makeSampleTask('Task 6'),
  makeSampleTask('Task 7'),
  makeSampleTask('Task 8'),
  makeSampleTask('Task 9'),
]

let completed = 0
let concurrency = 2
let running = 0
let nextTaskIndex = 0

function next() {
  while (running < concurrency && nextTaskIndex < tasks.length) {
    const task = tasks[nextTaskIndex++]
    task(() => {
      if (++completed === tasks.length) {
        return finish()
      }

      running--

      next()
    })

    running++
  }
}

next()

function finish() {
  // all the tasks completed
  console.log('All tasks executed!')
}
