import { readFile } from "node:fs";

const dirname = import.meta.dirname

readFile(dirname + '/data.txt', 'utf8', (_err, data) => {
  console.log(`Data from file: ${data}`)
})

let scheduledNextTick = 0
function recursiveNextTick() {
  if (scheduledNextTick++ >= 1000) return
  console.log('Keep the event loop busy')
  process.nextTick(recursiveNextTick)
}

recursiveNextTick()
