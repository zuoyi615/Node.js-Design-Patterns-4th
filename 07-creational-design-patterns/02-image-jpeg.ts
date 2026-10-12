import { Image } from './02-image.ts'
import { jpgRgx } from './02-factory-dynamic-class.ts'

export class ImageJpeg extends Image {
  constructor(path: string) {
    if (!path.match(jpgRgx)) {
      throw new Error(`${path} is not a JPEG image`)
    }

    super(path)
  }
}
