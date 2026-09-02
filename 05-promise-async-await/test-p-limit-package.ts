import pLimit from 'p-limit';

const limit = pLimit(2)

async function task(id: number) {
  console.log(`Start: ${id}`)
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000))
  console.log(`Finish: ${id}`)
  return id
}

const promises = [1, 2, 3, 4, 5, 6].map(id => {
  return limit(task.bind(null, id))
})

const results = await Promise.all(promises)

console.log(results)
