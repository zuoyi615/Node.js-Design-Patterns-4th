const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

type Resolve = (value: any) => void
type Reject = (error: Error) => void
type Executor = (resolve: Resolve, reject: Reject) => void

export class PromiseAPlus {
  #state = PENDING
  #value?: any = undefined
  #reason?: Error = undefined

  constructor(executor: Executor) {
    const resolve: Resolve = value => {
      if (this.#state !== PENDING) return
      this.#state = FULFILLED
      this.#value = value
    }

    const reject: Reject = reason => {
      if (this.#state !== PENDING) return
      this.#state = REJECTED
      this.#reason = reason
    }

    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e as Error)
    }
  }
}

// There is no then() method
const promise = new PromiseAPlus(resolve => resolve(Date.now()))
