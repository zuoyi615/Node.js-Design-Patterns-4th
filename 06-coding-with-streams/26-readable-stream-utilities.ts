import { createReadStream } from 'node:fs'
import { Readable, compose } from 'node:stream'
import { createInterface } from 'node:readline'
import { createGunzip } from 'node:zlib'

const uncompressedData = compose(
  createReadStream('data.csv.gz'),
  createGunzip(),
)

const byLine = createInterface({ input: uncompressedData, terminal: false })

const readableByLine = Readable.from(byLine)

type Data = {
  type: string
  country: string
  profit: number
}

const totalProfit = await readableByLine
  .drop(1)
  .map((chunk: string) => {
    const [type, country, profit] = chunk.split(',')

    return {
      type,
      country,
      profit: Number.parseFloat(profit)
    }
  })
  .filter((record: Data) => record.country === 'Italy')
  .reduce((acc, record: Data) => acc + record.profit, 0)

console.log({ totalProfit })
