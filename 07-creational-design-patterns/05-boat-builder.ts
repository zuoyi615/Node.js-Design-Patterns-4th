type BoatConfig = {
  hasMotor: boolean
  motorCount: number
  motorBrand: string
  motorModel: string
  hasSails: boolean
  sailsCount: number
  sailsMaterial: string
  sailsColor: string
  hullColor: string
  hasCabin: boolean
}

class Boat {
  hasMotor: boolean
  motorCount: number
  motorBrand: string
  motorModel: string
  hasSails: boolean
  sailsCount: number
  sailsMaterial: string
  sailsColor: string
  hullColor: string
  hasCabin: boolean

  constructor(config: BoatConfig) {
    this.hasMotor = Boolean(config.hasMotor)
    this.motorCount = config.motorCount || 0
    this.motorBrand = config.motorBrand || ''
    this.motorModel = config.motorModel || ''
    this.hasSails = Boolean(config.hasSails)
    this.sailsCount = config.sailsCount || 0
    this.sailsMaterial = config.sailsMaterial || ''
    this.sailsColor = config.sailsColor || ''
    this.hullColor = config.hullColor || ''
    this.hasCabin = Boolean(config.hasCabin)
  }
}

export class BoatBuilder {
  #hasMotor: boolean
  #motorCount: number
  #motorBrand: string
  #motorModel: string
  #hasSails: boolean
  #sailsCount: number
  #sailsMaterial: string
  #sailsColor: string
  #hullColor: string
  #hasCabin: boolean

  withMotors(count: number, brand: string, model: string) {
    this.#hasMotor = true
    this.#motorCount = count
    this.#motorBrand = brand
    this.#motorModel = model
    return this
  }

  withSails(count: number, material: string, color: string) {
    this.#hasSails = true
    this.#sailsCount = count
    this.#sailsMaterial = material
    this.#sailsColor = color
    return this
  }

  hullColor(color: string) {
    this.#hullColor = color
    return this
  }

  withCabin() {
    this.#hasCabin = true
    return this
  }

  build(): Boat {
    return new Boat({
      hasMotor: this.#hasMotor,
      motorCount: this.#motorCount,
      motorBrand: this.#motorBrand,
      motorModel: this.#motorModel,
      hasSails: this.#hasSails,
      sailsCount: this.#sailsCount,
      sailsMaterial: this.#sailsMaterial,
      sailsColor: this.#sailsColor,
      hasCabin: this.#hasCabin,
      hullColor: this.#hullColor,
    })
  }
}
