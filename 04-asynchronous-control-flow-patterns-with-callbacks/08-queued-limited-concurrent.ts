import { TaskQueue, type Callback, type Task } from './08-task-queue-event-emitter.ts'

const queue = new TaskQueue(2)

function makeSampleTask(name: string): Task {
  return (cb: Callback) => {
    console.log(`${name} started`)
    setTimeout(() => {
      console.log(`${name} completed`)
      cb(null)
    }, Math.random() * 2000)
  }
}

function task1(cb: Callback) {
  console.log('Task 1 started', queue.stats())

  queue
    .pushTask(makeSampleTask('task1 -> subtask 1'))
    .pushTask(makeSampleTask('task1 -> subtask 2'))

  setTimeout(() => {
    console.log('Task 1 completed', queue.stats())
    cb(null)
  }, Math.random() * 2000)
}

function task2(cb: Callback) {
  console.log('Task 2 started', queue.stats())

  queue
    .pushTask(makeSampleTask('task2 -> subtask 1'))
    .pushTask(makeSampleTask('task2 -> subtask 2'))

  setTimeout(() => {
    console.log('Task 1 completed', queue.stats())
    cb(null)
  }, Math.random() * 2000)
}

queue
  .pushTask(task1)
  .pushTask(task2)
