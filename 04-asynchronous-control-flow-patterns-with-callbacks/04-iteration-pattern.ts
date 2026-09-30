const tasks = [
  (cb: () => void) => {
    console.log('Task 1')
    setTimeout(cb, 1000)
  },
  (cb: () => void) => {
    console.log('Task 2')
    setTimeout(cb, 1000)
  },
  (cb: () => void) => {
    console.log('Task 3')
    setTimeout(cb, 1000)
  }
]

function iterate(index: number, cb: () => void) {
  if (index === tasks.length) {
    return cb()
  }

  const task = tasks[index]

  // task(() => iterate(index + 1, cb))
  task(iterate.bind(null, index + 1, cb))
}

function finish() {
  console.log('All tasks executed')
}

iterate(0, finish)
