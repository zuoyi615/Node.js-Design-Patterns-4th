import { BlueConsole } from './e-1-blue-console.ts'
import { RedConsole } from './e-1-red-console.ts'
import { GreenConsole } from './e-1-green-console.ts'

export function createColorConsole(color: string) {
  if (color === 'red') return new RedConsole()
  if (color === 'blue') return new BlueConsole()
  if (color === 'green') return new GreenConsole()
  throw new Error('Color type not supported')
}
