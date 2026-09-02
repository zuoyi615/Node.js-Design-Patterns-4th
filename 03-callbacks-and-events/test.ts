setTimeout(() => {
  console.log('timeout 0');
}, 0);

setTimeout(() => {
  console.log('timeout 1000');
}, 1000);

setImmediate(() => {
  console.log('immediate');
});

Promise.resolve().then(() => {
  console.log('promise');
});

process.nextTick(() => {
  console.log('nextTick');
});

console.log('sync');
