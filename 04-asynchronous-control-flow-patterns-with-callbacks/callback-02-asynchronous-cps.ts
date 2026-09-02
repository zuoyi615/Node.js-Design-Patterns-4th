function asyncTask(callback: (message: string) => void) {
  // process.nextTick(callback.bind(null, 'done'))
  setImmediate(callback.bind(null, 'done'))
  // setTimeout(callback.bind(null, 'done'), 1000)
}

console.log('before')

asyncTask(message => {
  console.log(message)
})

console.log('after')
