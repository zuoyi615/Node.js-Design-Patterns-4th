import { Image } from './02-image.ts'
import { gifRgx } from './02-factory-dynamic-class.ts'

export class ImageGif extends Image {
  constructor(path: string) {
    if (!path.match(gifRgx)) {
      throw new Error(`${path} is not a GIF image`)
    }

    super(path)
  }
}
