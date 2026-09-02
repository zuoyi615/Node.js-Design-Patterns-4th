import { spider } from "./08-queued-spider.ts";
import { TaskQueue } from "./08-task-queue-event-emitter.ts";

//    0          1      2          3             4 
// node spider-cli <link> [maxDepth] [concurrency]
// e.g: node spider-cli https://nodejsdesignpatterns.com 3 3

const url = process.argv[2]
const maxDepth = Number.parseInt(process.argv[3], 10) || 1
const concurrency = Number.parseInt(process.argv[4], 10) || 2
const queue = new TaskQueue(concurrency)

queue.on('error', err => console.log(err))
queue.on('empty', () => console.log('finished'))

spider(url, maxDepth, queue)
