type Callback = (err: Error | null) => void

type Iterator = (n: number, next: Callback) => void

export function iterate(items: number[], iterator: Iterator, cb: Callback) {
  let index = 0

  function next(err: Error | null) {
    if (err) return cb(err)
    if (index === items.length) return cb(null)
    iterator(items[index++], next)
  }

  next(null)
}

iterate(
  [1, 2, 3],
  (n, next) => {
    setTimeout(() => {
      console.log(n)
      next(null)
    }, 300)
  },
  err => {
    if (err) {
      console.log(err)
      return
    }

    console.log('async Iteration finished')
  }
)
