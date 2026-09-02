function delay(milliseconds: number) {
  return new Promise(resolve => {
    setTimeout(resolve.bind(null, Date.now()), milliseconds)
  })
}

function leakingLoop(): Promise<void> {
  return delay(5).then(() => {
    console.log(`Tick ${Date.now()}`)
    return leakingLoop()
  })
}

function nonLeakingLoop() {
  delay(5).then(() => {
    console.log(`Tick ${Date.now()}`)
    nonLeakingLoop()
  })
}

function nonLeakingLoopWithErrors() {
  return new Promise((_, reject) => {
    (function internalLoop() {
      delay(1)
        .then(() => {
          console.log(`Tick ${Date.now()}`)
          internalLoop()
        })
        .catch(err => {
          reject(err)
        })
    })()
  })
}

async function leakingLoopAsync() {
  await delay(1)
  console.log(`Tick ${Date.now()}`)
  return leakingLoopAsync()
}

async function nonLeakingLoopAsync() {
  while (true) {
    await delay(1)
    console.log(`Tick ${Date.now()}`)
  }
}

for (let i = 0; i < 1e6; i++) {
  // leakingLoop()
  // nonLeakingLoop()
  // nonLeakingLoopWithErrors()
  leakingLoopAsync()
  // nonLeakingLoopAsync()
}
