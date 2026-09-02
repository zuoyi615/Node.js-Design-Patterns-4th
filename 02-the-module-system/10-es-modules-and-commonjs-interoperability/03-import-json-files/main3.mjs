import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

const joinPath = join(import.meta.dirname, 'sample.json')

try {
  const dataRaw = await readFile(joinPath)
  const data = JSON.parse(dataRaw)
  console.log(data)
} catch (e) {
  console.log(e)
}
