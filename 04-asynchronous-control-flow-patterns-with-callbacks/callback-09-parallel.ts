type Task = ReturnType<typeof makeSampleTask>

export function makeSampleTask(name: string) {
  return (cb: (err: Error | null, name: string) => void) => {
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
]

type Callback = (err: Error | null, value: string[] | null) => void

function parallel(tasks: Task[], cb: Callback) {
  const results: string[] = []
  let completed = 0

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    task((err, value) => {
      if (err) return cb(err, null)

      results[i] = value // ordered
      // results.push(value) // disordered

      completed++

      if (completed === tasks.length) cb(null, results)
    })
  }
}

parallel(tasks, (err, results) => {
  if (err) {
    console.log(err)
    return
  }

  console.log({
    results,
  })
})
