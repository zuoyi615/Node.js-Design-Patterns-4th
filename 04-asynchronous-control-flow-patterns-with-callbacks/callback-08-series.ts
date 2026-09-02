type Task = ReturnType<typeof makeSampleTask>

export function makeSampleTask(name: string) {
  return (value: string | null, cb: (err: Error | null, name: string) => void) => {
    console.log(`${name} started`)
    setTimeout(() => {
      console.log(`[${name}] completed`)
      if (value) {
        const result = `${value} -> ${name}`
        return cb(null, result)
      }

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
]

type Callback = (err: Error | null, value: string | null) => void

function series(tasks: Task[], cb: Callback) {
  let index = 0
  let result: string | null

  function next(err: Error | null, value: string | null) {
    if (err) return cb(err, null)

    result = value

    if (index === tasks.length) {
      return cb(null, result)
    }

    const task = tasks[index++]
    task(result, next)
  }

  next(null, '')
}

series(tasks, (err, value) => {
  if (err) {
    return console.error(err)
  }

  console.log({
    value,
  })
})
