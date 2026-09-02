import { EventEmitter } from "node:events"

// 0. main function: closure
function tick(delay: number, callback: (err: Error | null, count: number) => void) {
  const emitter = new EventEmitter()
  const TICK_INTERVAL = 50
  const startTime = Date.now()

  let count = 0

  function emitTick() {
    emitter.emit('tick', count)
    count++
  }

  // emit a `tick` event immediately after the function is invoked
  setImmediate(emitTick)
  // process.nextTick(emitTick)

  setTimeout(function recursiveTimeout() {
    if (Date.now() - startTime >= delay) {
      return callback(null, count)
    }

    emitTick()

    setTimeout(recursiveTimeout, TICK_INTERVAL)
  }, TICK_INTERVAL)

  return emitter
}

// 1. initialize tick event emitter: callback, asynchronous
const emitter = tick(1200, (err, count) => {
  if (err) {
    console.error(err)
    return
  }

  console.log(`Totally ticked ${count} times.`)
})

// 2. add listeners: synchronous
emitter
  .on('error', error => console.log('Emitted error', error))
  .on('tick', (count: number) => console.log('Tick #', count.toString().padStart(2, '0')))
