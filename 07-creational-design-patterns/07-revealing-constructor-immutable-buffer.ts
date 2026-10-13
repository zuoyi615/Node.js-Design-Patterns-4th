const MODIFIER_NAMES = ['swap', 'write', 'fill'] as const

type Executor = (modifiers: any) => void

export class ImmutableBuffer {
  constructor(size: number, executor: Executor) {
    const buffer = Buffer.alloc(size)
    const modifiers = {}
    for (const prop in buffer) {
      const v = buffer[prop]
      if (typeof v === 'function') {
        if (MODIFIER_NAMES.some(n => prop.startsWith(n))) {
          // @ts-ignore
          modifiers[prop] = buffer[prop].bind(buffer)
        } else {
          // @ts-ignore
          this[prop] = buffer[prop].bind(buffer)
        }
      }
      continue

    }

    executor(modifiers)
  }
} 
