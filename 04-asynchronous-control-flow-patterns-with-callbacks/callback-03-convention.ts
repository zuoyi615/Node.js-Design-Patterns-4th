export { }

function asyncOperation(name: string, cb: (err: Error | null, name: string | null) => void) {
  // some async opertions
  if (name.length > 5) {
    return cb(new Error(''), null)
  }

  cb(null, name)
}
