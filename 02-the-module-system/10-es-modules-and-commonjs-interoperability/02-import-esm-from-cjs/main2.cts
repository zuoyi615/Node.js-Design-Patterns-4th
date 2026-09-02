'use strict'

async function main() {
  const { someFeature } = await import('./some-module.mts')
  console.log(someFeature)
}

main().then()
