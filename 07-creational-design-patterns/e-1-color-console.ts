export class ColorConsole {
  #color: string

  constructor(color: string) {
    this.#color = color
  }

  log() {
    console.log(`I'm ${this.#color}`)
  }
}
