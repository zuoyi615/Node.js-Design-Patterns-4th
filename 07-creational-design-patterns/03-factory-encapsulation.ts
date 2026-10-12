export function createPerson(name: string) {
  const privateProperties: Record<string, any> = {}
  const person = {
    setName(name: string) {
      if (!name) {
        throw new Error('A person must have a name')
      }

      privateProperties.name = name
    },
    getName(): string {
      return privateProperties.name
    }
  }

  person.setName(name)

  return person
}

const person = createPerson('Jon')

console.log({
  person,
  name: person.getName(),
})
