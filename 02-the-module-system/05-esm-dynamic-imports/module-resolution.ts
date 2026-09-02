// relative import
console.log(import.meta.resolve('./strings-it.ts'))

// Node.js core module import
console.log(import.meta.resolve('assert'))

console.log(import.meta.resolve('node:assert'))

// Third-party library
console.log(import.meta.resolve('express'))
