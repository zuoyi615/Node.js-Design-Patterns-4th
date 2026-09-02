type Resolve = <T = any>(value: T) => void
type Reject = (Reason?: any) => void
type Executor = (resolve: Resolve, reject: Reject) => void

export class LazyPromise<T> extends Promise<T> {
  #resolve: Resolve
  #reject: Reject
  #executor: Executor
  #promise: Promise<T> | null

  constructor(executor: Executor) {
    let _resolve: Resolve
    let _reject: Reject
    super((resolve, reject) => {
      _resolve = resolve
      _reject = reject
    })
    this.#executor = executor
    this.#resolve = _resolve!
    this.#reject = _reject!
  }

  #ensureInit() {
    if (!this.#promise) {
      this.#promise = new Promise<T>(this.#executor)
      this.#promise.then(this.#resolve, this.#reject)
    }

    return this.#promise
  }

  then(onFufilled?: Resolve, onRejected?: Resolve) {
    this.#ensureInit().then(onFufilled, onRejected)
  }

  catch(onRejected: Resolve) {
    this.#ensureInit().catch(onRejected)
  }

  finally(onFinally: () => void) {
    this.#ensureInit().finally(onFinally)
  }
}

const lazyPromise = new LazyPromise(resolve => {
  console.log('Executor Started!')
  setTimeout(resolve.bind(null, 'completed'), 1000)
})
console.log('Lazy Promise instance created!')
console.log(lazyPromise)
lazyPromise.then(v => {
  console.log(v)
  console.log(lazyPromise)
})
