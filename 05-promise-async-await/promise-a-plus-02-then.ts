const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

type Resolve = (value: any) => void
type Reject = (error: Error) => void
type Executor = (resolve: Resolve, reject: Reject) => void
type OnFulfilled = (value: any) => void
type OnRejected = (Error?: Error) => void

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

  then(onFulfilled?: OnFulfilled, onRejected?: OnRejected) {
    return new PromiseAPlus((resolve, reject) => {
      if (this.#state === PENDING) {
        const x = onFulfilled?.(this.#value)
        return resolve(x)
      }

      if (this.#state === REJECTED) {
        try {
          const x = onRejected?.(this.#reason)
          return resolve(x)
        } catch (e) {
          reject(e as Error)
        }
      }
    })
  }
}

const promise = new PromiseAPlus(resolve => resolve(Date.now()))

promise.then(x => console.log(x)).then().then()
