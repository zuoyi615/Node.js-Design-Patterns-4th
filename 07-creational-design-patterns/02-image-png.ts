import { Image } from './02-image.ts'
import { pngRgx } from './02-factory-dynamic-class.ts'

export class ImagePng extends Image {
  constructor(path: string) {
    if (!path.match(pngRgx)) {
      throw new Error(`${path} is not a PNG image`)
    }

    super(path)
  }
}
