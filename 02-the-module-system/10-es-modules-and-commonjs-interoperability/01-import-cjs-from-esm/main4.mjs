import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const { someFeature } = require('./some-module.cjs')

console.log(someFeature)
