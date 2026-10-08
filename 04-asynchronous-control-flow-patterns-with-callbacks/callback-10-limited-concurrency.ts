type Task = ReturnType<typeof makeSampleTask>

export function makeSampleTask(name: string) {
  return (cb: (err: Error | null, value: string) => void) => {
    console.log(`${name} started`)
    setTimeout(() => {
      console.log(`[${name}] completed`)
      cb(null, name)
    }, Math.random() * 2000)
  }
}

const tasks: Task[] = [
  makeSampleTask('Task 1'),
  makeSampleTask('Task 2'),
  makeSampleTask('Task 3'),
  makeSampleTask('Task 4'),
  makeSampleTask('Task 5'),
  makeSampleTask('Task 6'),
  makeSampleTask('Task 7'),
  makeSampleTask('Task 8'),
]

type Callback = (err: Error | null, results?: string[]) => void

function runWithConcurrency(tasks: Task[], limit: number, cb: Callback) {
  let index = 0
  let completed = 0
  let running = 0
  const results: string[] = []

  function next() {
    while (running < limit && index < tasks.length) {
      const i = index
      const task = tasks[index++]
      running++
      task((err, value) => {
        if (err) return cb(err)
        results[i] = value
        if (++completed === tasks.length) return cb(null, results)
        running--
        next()
      })
    }
  }

  next()
}

runWithConcurrency(tasks, 3, (err, results) => {
  if (err) {
    return console.log(err)
  }

  console.log({ results })

  console.log('All tasks finished')
})
