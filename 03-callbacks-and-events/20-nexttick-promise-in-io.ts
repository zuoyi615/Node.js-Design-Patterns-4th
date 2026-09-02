// CommonJS 中通常 nextTick 在 microtask 前
// ESM 模块处理中，microtask 可以先于 nextTick, 特别是在非 IO 的条件下，比如 main module 中
// type: 'module', 在 ESM 中，模块本身的执行已经处于 microtask 的处理环境

import { readFile } from "node:fs";
import { URL } from "node:url";

console.log('A');

const filePath = new URL('file-B.json', import.meta.url)
readFile(filePath, 'utf8', (err, data) => {
  process.nextTick(() => {
    console.log('nextTick');
  });

  Promise.resolve().then(() => {
    console.log('promise');
  });

  queueMicrotask(() => {
    console.log('microtask');
  });
})

console.log('B');
