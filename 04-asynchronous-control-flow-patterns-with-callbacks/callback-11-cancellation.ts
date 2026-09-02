export function makeSampleTask(name: string) {
  return (cb: (err: Error | null) => void) => {
    console.log(`[${name}] started`)
    setTimeout(() => {
      console.log(`[${name}] completed`)
      cb(null)
    }, Math.random() * 2000)
  }
}

const task = makeSampleTask('task cancellation')

type Callback = (err: Error | null) => void

let canceled = false
function cancelTask(cb: Callback) {
  task(err => {
    if (canceled) return
    if (err) return cb(err)
    cb(null)
  })
}

cancelTask(err => {
  if (err) {
    console.log(err)
    return
  }

  console.log('uncanceled task finished')
})

canceled = true
