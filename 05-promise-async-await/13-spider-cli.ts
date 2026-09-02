import { spider } from './13-async-await-web-spider-v4.ts';
import { TaskQueue } from './task-queue.ts';
import { once } from 'node:events'

// node 13-spider-cli.ts https://nodejsdesignpatterns.com/blog 3 2

const url = process.argv[2]
const maxDepth = Number.parseInt(process.argv[3], 10) || 1
const concurrency = Number.parseInt(process.argv[4], 10) || 2

const queue = new TaskQueue(concurrency)

queue.on('error', console.error)

queue.pushTask(spider.bind(null, url, maxDepth, queue))

await once(queue, 'empty')

console.log('Download complete')
