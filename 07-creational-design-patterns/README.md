# Creational Design Patterns

Creational design patterns address problems related to the creation of objects.

- Factory Pattern
- Builder Pattern
- Revealing Constructor Pattern
- Singleton Pattern
- Dependency Injection

## Factory Pattern

Its main advantage is its ability to decouple the creation of an object from a specific implementation.

- Decoupling object creation and implementation
- A mechanism to enforce encapsulation: function scopes and closures

## Builder Pattern

Builder is a creational pattern that simplifies the creation of complex objects by providing a fluent interface.

situation: a class with a constructor that has a long list of arguments or takes many complex parameters as input.

### General rules for implementating the Builder pattern

- the main objective is to break down a complex constructor into multiple, more readable, and more manageable steps.
- try to create builder methods that can set multiple related parameters at once
- Deduce and implicitly set parameters based on the values received as input by a setter method
- If necessary, it’s possible to further manipulate the parameters.
- Consider providing sensible default values for parameters that are not explicitly set

## Revealing Constructor Pattern

Revealing constructor pattern solves a tricky problem:

> How can we "reveal" some private functionality of an object only at the moment of the object's creation.
> Allows scenarios:
> 1. Creating objects that can be modified only at creation time
> 2. Creating objects whose custom behavior only can be defined only at creation time
> 3. Create objects that can be initialized only once at creation time

## Singleton

Reasons to use a single instance:

- For sharing stateful information
- For optimizing resource usage
- To synchronize access to a resource

```ts
import { Database } from './db.ts'

// Singleton in current package
// this implementation isn’t a strict implementation of the Singleton pattern
export const dbInstance = new Database('my-app-db', {
  url: 'localhost:5432',
  username: 'user',
  password: 'password',
})
```
