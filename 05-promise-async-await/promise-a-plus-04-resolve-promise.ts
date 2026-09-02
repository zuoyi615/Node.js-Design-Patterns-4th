const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

type Resolve = (value: any) => void
type Reject = (error: Error) => void
type Executor = (resolve: Resolve, reject: Reject) => void
type OnFulfilled = (value: any) => any
type OnRejected = (Error: Error) => never
type Callback = () => void

export class PromiseAPlus {
  #state = PENDING
  #value?: any = undefined
  #reason?: Error = undefined
  #onFulfilledCallbacks: Callback[] = []
  #onRejectedCallbacks: Callback[] = []

  constructor(executor: Executor) {
    const resolve: Resolve = value => {
      if (this.#state !== PENDING) return
      this.#state = FULFILLED
      this.#value = value

      for (const cb of this.#onFulfilledCallbacks) {
        cb()
      }
    }

    const reject: Reject = reason => {
      if (this.#state !== PENDING) return
      this.#state = REJECTED
      this.#reason = reason

      for (const cb of this.#onRejectedCallbacks) {
        cb()
      }
    }

    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e as Error)
    }
  }

  then(onFulfilled?: OnFulfilled, onRejected?: OnRejected) {
    // handlers could be null
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }

    let promiseNext: PromiseAPlus
    promiseNext = new PromiseAPlus((resolve, reject) => {
      const fulfilledTask: Callback = () => {
        queueMicrotask(() => {
          const x = onFulfilled(this.#value)
          resolvePromise(
            promiseNext,
            x,
            resolve,
            reject,
          )
        })
      }

      const rejectedTask: Callback = () => {
        queueMicrotask(() => {
          const x = onRejected(this.#reason!)
          resolvePromise(
            promiseNext,
            x,
            resolve,
            reject,
          )
        })
      }

      if (this.#state === PENDING) {
        this.#onFulfilledCallbacks.push(fulfilledTask)
      }

      if (this.#state === REJECTED) {
        this.#onRejectedCallbacks.push(rejectedTask)
      }

      if (this.#state === PENDING) {
        this.#onFulfilledCallbacks.push(fulfilledTask)
        this.#onRejectedCallbacks.push(rejectedTask)
      }
    })

    return promiseNext
  }
}

const promise = new PromiseAPlus(resolve => resolve(Date.now()))

function resolvePromise(promise: PromiseAPlus, x: any, resolve: Resolve, reject: Reject) {
  if (promise === x) {
    throw new Error('Chained cycle detected')
  }

  if (x != null && (typeof x === 'object' || typeof x === 'function')) {
    let called = false

    try {
      const then = x.then // x maybe nullable value
      if (typeof then === 'function') { // thenable, then belongs to x
        then.call(
          x,
          (y: any) => {
            if (called) return
            called = true

            // recursively expand
            resolvePromise(
              promise,
              y,
              resolve,
              reject,
            )
          },
          (reason: Error) => {
            if (called) return
            called = true
            reject(reason)
          }
        )
        return
      }

      resolve(x) // normal value: string, number, {}, []
    } catch (e) {
      if (!called) {
        reject(e as Error)
      }
    }

    return
  }

  resolve(x)
}

promise.then(x => console.log(x))
