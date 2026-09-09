export { }

const res = await fetch('http://jsonplaceholder.typicode.com/todos')
const json = await res.json()
// const text = await res.text()
// const buffer = await res.arrayBuffer()
// const blob = await res.blob()
// there is no .buffer() method, because `Buffer` class it not part of the Web Standard
// `Buffer` exists only in Node.js

console.log(json)
