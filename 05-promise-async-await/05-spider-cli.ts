import { spider } from './05-promises-web-spider-v4.ts';
import { TaskQueue } from './task-queue.ts';

// node 05-spider-cli.ts https://nodejsdesignpatterns.com/blog 3 2

const url = process.argv[2]
const maxDepth = Number.parseInt(process.argv[3], 10) || 1
const concurrency = Number.parseInt(process.argv[4], 10) || 2

const queue = new TaskQueue(concurrency)

queue.on('error', console.error)

queue.on('empty', () => console.log('Download complete'))

queue.pushTask(spider.bind(null, url, maxDepth, queue))
