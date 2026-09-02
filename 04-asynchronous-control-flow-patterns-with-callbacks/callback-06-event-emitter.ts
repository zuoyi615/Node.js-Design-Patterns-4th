import { EventEmitter } from 'node:events'

/**
 * EventEmitter is an observe pattern: an object fires an event with some other codes to listen/observe this event
 * EventEmitter is synchronous
 */

const emitter = new EventEmitter()

emitter.on('data', data => {
  console.log('received: ', data)
})

emitter.emit('data', 'hello')

emitter.emit('error', new Error('failed')) // may crash Node.js if no listeners for error event

