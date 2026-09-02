export function promiseAll(list: Promise<unknown>[]) {
  return new Promise<unknown[]>((resolve, reject) => {
    const promises = Array.from(list)
    const results: unknown[] = []

    if (promises.length === 0) {
      return resolve(results)
    }

    let completed = 0
    const { length } = list

    for (let i = 0; i < length; i++) {
      const item = list[i];
      item
        .then(
          value => {
            results[i] = value
            completed++

            if (completed === length) {
              resolve(results)
            }
          },
          reject
        )
    }
  })
}

function delay(millisecends: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Resolved ${millisecends}')
      resolve(millisecends)
    }, millisecends)
  })
}

const results = await promiseAll([
  delay(50),
  delay(100),
  delay(150),
  delay(200),
  delay(250),
  delay(300),
  delay(400),
])

console.log(results)
