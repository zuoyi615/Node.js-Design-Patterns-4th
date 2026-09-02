import { spider } from "./06-concurrent-web-spider-links.ts";

// node spider-cli <link> [maxDepth]

const url = process.argv[2]
const maxDepth = Number.parseInt(process.argv[3], 10) || 1

spider(url, maxDepth, err => {
  if (err) {
    console.log(err)
    process.exit(1)
  }

  console.log('Download complete')
})
