import { readFile } from "node:fs";

readFile(import.meta.filename, () => {
  console.log('I/O');

  process.nextTick(() => {
    console.log('nextTick');
    Promise.resolve(1).then(n => console.log(n))
  });

  Promise.resolve().then(() => {
    console.log('promise');
  });

  setImmediate(() => {
    console.log('immediate');
    process.nextTick(() => {
      console.log('tick in immediate')
      Promise.resolve('2-in-tick').then(n => console.log(n))
    })
    Promise.resolve(2).then(n => console.log(n))
  });

  setTimeout(() => {
    console.log('timeout 0');
    process.nextTick(() => {
      console.log('tick in timeout')
      Promise.resolve('3-in-tick').then(n => console.log(n))
    })
    Promise.resolve(3).then(n => console.log(n))
  }, 0);
});
