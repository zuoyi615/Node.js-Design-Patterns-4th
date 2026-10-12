import { BoatBuilder } from './05-boat-builder.ts';

const boat = new BoatBuilder()
  .withCabin()
  .hullColor('blue')
  .withMotors(2, 'Best Motor Co.', 'OM123')
  .withSails(1, 'fabric', 'white')
  .build()

console.log(boat)
