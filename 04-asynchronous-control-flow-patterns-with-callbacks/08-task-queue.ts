type Callback = () => void
type Task = (cb: Callback) => void

class TaskQueue {
  #queue: Task[]
  #concurrency: number
  #running: number

  constructor(concurrency: number) {
    this.#concurrency = concurrency
    this.#running = 0
    this.#queue = []
  }

  pushTask(task: Task) {
    this.#queue.push(task)
    process.nextTick(this.next.bind(this))
    return this
  }

  next() {
    while (this.#running < this.#concurrency && this.#queue.length > 0) {
      const task = this.#queue.shift()
      if (!task) continue

      task(() => {
        this.#running--
        process.nextTick(this.next.bind(this))
      })

      this.#running++
    }
  }
}

export default TaskQueue
