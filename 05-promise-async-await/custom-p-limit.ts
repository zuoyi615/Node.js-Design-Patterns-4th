type Run = () => Promise<void>

export function pLimit(concurrency: number) {
  let activeCount = 0
  const queue: Run[] = []

  // limited concurrency
  function next() {
    if (activeCount >= concurrency) return

    const task = queue.shift()

    if (!task) return

    task()
  }

  function limit(fn: () => Promise<any>) {
    return new Promise((resolve, reject) => {
      const run = async () => {
        activeCount++

        try {
          const result = await fn()
          resolve(result)
        } catch (e) {
          reject(e)
        } finally {
          activeCount--
          next()
        }
      }

      queue.push(run)

      next()
    })
  }

  return limit
}

async function task(id: number) {
  console.log('start', id);
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
  console.log('finish', id);
  return id;
}

const limit = pLimit(2)

const results = await Promise.all([
  limit(task.bind(null, 1)),
  limit(task.bind(null, 2)),
  limit(task.bind(null, 3)),
  limit(task.bind(null, 4)),
  limit(task.bind(null, 5)),
  limit(task.bind(null, 6)),
  limit(task.bind(null, 7)),
  limit(task.bind(null, 8)),
])

console.log(results)
