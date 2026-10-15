type Observer = (data: { prop: string, prev: any, curr: any }) => void

export function createObservable(target: object, observer: Observer) {
  const observable = new Proxy(target, {
    set(o: any, prop, value) {
      if (value !== o[prop]) {
        const prev = o[prop]
        o[prop] = value

        observer({ prop: prop as string, prev, curr: value })
      }

      return true
    }
  })

  return observable
}
