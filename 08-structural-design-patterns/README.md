# Structural Design Patterns

Structural pattterns help us define relationships between components, enabling flexible and efficient architectures.

- **Proxy**: Control access to an object by standing in for it
- **Decorator**: Dynamically extend or modify an object's behavior
- **Adapter**: Bridge incompatible interfaces to enable soomth collaboration

## Proxy

> A **proxy** is an object that controls access to another object, called the **subject**.
> The proxy and the subject have an identical interface, and this allows us to swap one for the other transparently.

Proxy pattern isn't about proxy between classess, but involving wrapping an actual instance of the subject.

### Proxy scenarios

- Data validation
- Security
- Caching
- Lazy initialization
- Observability
- Remote objects

