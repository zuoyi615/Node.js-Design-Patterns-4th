import { spider } from "./01-web-spider.ts";

// console.log(process.argv)

spider(process.argv[2], (err, filename, downloaded) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }

  if (downloaded) {
    console.log(`Completed the download of "${filename}".`)
    return
  }

  console.log(`"${filename}" was already downloaded.`)
})
