function addAsyncCps(a: number, b: number, cb: (r: number) => void) {
  setTimeout(() => cb(a + b), 1000)
}
