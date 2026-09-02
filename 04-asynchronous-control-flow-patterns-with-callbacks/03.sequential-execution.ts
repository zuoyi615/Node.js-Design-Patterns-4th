type Callback = () => void

/**
  * sequential execution common pattern
  * pass recursively callback as the final result receiver
  * if no data is needed, callback's arguments are empty.
  */

// I/O, timers, setImmediate, process.nextTick()
function asyncOperation(cb: Callback) {
  // process.nextTick(cb)
  setImmediate(cb)
}

// first
function tasks1(cb: Callback) {
  asyncOperation(() => {
    tasks2(cb)
  })
}

// second
function tasks2(cb: Callback) {
  asyncOperation(() => {
    tasks3(cb)
  })
}

// third
function tasks3(cb: Callback) {
  asyncOperation(() => {
    cb()
  })
}

// Start: pass the completion callback
tasks1(() => {
  console.log('tasks 1, 2, and 3 executed')
})
