import { EventEmitter } from "node:events"

export type Callback = (err?: Error | null) => void

export type Task = () => Promise<void>

export class TaskQueue extends EventEmitter {
  #queue: Task[]
  #concurrency: number
  #running: number

  constructor(concurrency: number) {
    super()
    this.#concurrency = concurrency
    this.#running = 0
    this.#queue = []
  }

  pushTask(task: Task) {
    this.#queue.push(task)
    process.nextTick(this.next.bind(this))
    return this
  }

  async next() {
    if (this.#running === 0 && this.#queue.length === 0) {
      return this.emit('empty')
    }

    while (this.#running < this.#concurrency && this.#queue.length > 0) {
      const task = this.#queue.shift()
      if (!task) {
        this.emit('skip')
        continue
      }

      try {
        await task()
      } catch (err) {
        this.emit('error', err)
      } finally {
        this.#running--
        this.next()
      }

      this.#running++
    }
  }

  stats() {
    return {
      running: this.#running,
      scheduled: this.#queue.length,
    }
  }
}

