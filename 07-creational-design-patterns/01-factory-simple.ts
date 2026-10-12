import { Image } from './01-image.ts'

function createImage(name: string) {
  return new Image(name)
}

const image = createImage('photo.jpeg')

console.log(image)
