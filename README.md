# @lei.wei/rs-result

A Rust-style `Result<T, E>` type library for TypeScript, providing a safe and expressive way to handle errors without exceptions.

## Features

- **Type Safety**: Full TypeScript support with comprehensive type inference
- **Rust-like API**: Familiar methods from Rust's `Result` type
- **Zero Dependencies**: Only depends on `rs-option` for Option type support
- **Dual Format**: Supports both ESM and CommonJS

## Installation

```bash
npm install @lei.wei/rs-result
```

## Basic Usage

```typescript
import { Ok, Err, Result } from '@lei.wei/rs-result';

// Creating Results
const success: Result<number, string> = Ok(42);
const failure: Result<number, string> = Err('Something went wrong');

// Checking result type
if (success.isOk()) {
  console.log('Success!');
}

if (failure.isErr()) {
  console.log('Error:', failure.unwrapErr());
}
```

## API Reference

### Constructors

#### `Ok<T>(value: T): Result<T, never>`

Creates an `Ok` variant containing a value.

```typescript
const result = Ok(42);
```

#### `Err<E>(error: E): Result<never, E>`

Creates an `Err` variant containing an error.

```typescript
const result = Err('Something went wrong');
```

### Querying the Result

#### `isOk(): boolean`

Returns `true` if the result is `Ok`.

```typescript
const result = Ok(42);
result.isOk(); // true
```

#### `isErr(): boolean`

Returns `true` if the result is `Err`.

```typescript
const result = Err('error');
result.isErr(); // true
```

#### `ok(): Option<T>`

Converts to `Option<T>`, discarding the error value if present.

```typescript
const result = Ok(42);
result.ok(); // Some(42)

const result = Err('error');
result.ok(); // None
```

#### `err(): Option<E>`

Converts to `Option<E>`, discarding the success value if present.

```typescript
const result = Err('error');
result.err(); // Some('error')

const result = Ok(42);
result.err(); // None
```

### Transforming the Result

#### `map<U>(op: (value: T) => U): Result<U, E>`

Maps a `Result<T, E>` to `Result<U, E>` by applying a function to the contained `Ok` value, leaving an `Err` value untouched.

```typescript
const result = Ok(42).map(x => x * 2);
result.unwrap(); // 84

const error = Err('error').map(x => x * 2);
error.unwrapErr(); // 'error'
```

#### `mapOr<U>(defaultValue: U, op: (value: T) => U): U`

Returns the provided default value if `Err`, otherwise applies the function to the `Ok` value and returns the result.

```typescript
Ok(42).mapOr(0, x => x * 2); // 84
Err('error').mapOr(0, x => x * 2); // 0
```

#### `mapOrElse<U>(defaultOp: (error: E) => U, op: (value: T) => U): U`

Maps a `Result<T, E>` to `U` by applying fallback function to a contained `Err` value, or function to a contained `Ok` value.

```typescript
Ok(42).mapOrElse(e => 0, x => x * 2); // 84
Err('error').mapOrElse(e => e.length, x => x * 2); // 5
```

#### `mapErr<F>(op: (error: E) => F): Result<T, F>`

Maps a `Result<T, E>` to `Result<T, F>` by applying a function to the contained `Err` value, leaving an `Ok` value untouched.

```typescript
const result = Err('error').mapErr(e => e.toUpperCase());
result.unwrapErr(); // 'ERROR'
```

### Combining Results

#### `and<U>(res: Result<U, E>): Result<U, E>`

Returns `res` if the result is `Ok`, otherwise returns the `Err` value of `self`.

```typescript
Ok(2).and(Ok('foo')); // Ok('foo')
Err('early error').and(Ok('foo')); // Err('early error')
```

#### `andThen<U>(op: (value: T) => Result<U, E>): Result<U, E>`

Calls `op` if the result is `Ok`, otherwise returns the `Err` value of `self`.

```typescript
Ok(2).andThen(x => Ok(x * 2)); // Ok(4)
Err('error').andThen(x => Ok(x * 2)); // Err('error')
```

#### `or<F>(res: Result<T, F>): Result<T, F>`

Returns `self` if it contains `Ok`, otherwise returns `res`.

```typescript
Ok(2).or(Err('late error')); // Ok(2)
Err('early error').or(Ok('foo')); // Ok('foo')
```

#### `orElse<F>(op: (error: E) => Result<T, F>): Result<T, F>`

Calls `op` if the result is `Err`, otherwise returns the `Ok` value of `self`.

```typescript
Ok(2).orElse(() => Ok('foo')); // Ok(2)
Err('error').orElse(() => Err('fallback')); // Err('fallback')
```

### Unwrapping Values

#### `unwrap(): T`

Returns the contained `Ok` value. Throws an error if the value is `Err`.

```typescript
Ok(42).unwrap(); // 42
Err('error').unwrap(); // throws Error
```

#### `unwrapOr(defaultValue: T): T`

Returns the contained `Ok` value or a provided default.

```typescript
Ok(42).unwrapOr(0); // 42
Err('error').unwrapOr(0); // 0
```

#### `unwrapOrElse(op: (error: E) => T): T`

Returns the contained `Ok` value or computes it from a closure.

```typescript
Ok(42).unwrapOrElse(() => 0); // 42
Err('error').unwrapOrElse(() => 42); // 42
```

#### `expect(message: string): T`

Returns the contained `Ok` value. Throws an error with the provided message if the value is `Err`.

```typescript
Ok(42).expect('should not panic'); // 42
Err('error').expect('custom error'); // throws Error('custom error')
```

#### `unwrapErr(): E`

Returns the contained `Err` value. Throws an error if the value is `Ok`.

```typescript
Err('error').unwrapErr(); // 'error'
Ok(42).unwrapErr(); // throws Error
```

#### `expectErr(message: string): E`

Returns the contained `Err` value. Throws an error with the provided message if the value is `Ok`.

```typescript
Err('error').expectErr('should not panic'); // 'error'
Ok(42).expectErr('custom error'); // throws Error('custom error')
```

### Inspecting the Result

#### `inspect(op: (value: T) => void): Result<T, E>`

Calls the provided closure with a reference to the contained value if `Ok`.

```typescript
let captured: number | null = null;
const result = Ok(42).inspect(x => { captured = x; });
console.log(captured); // 42
result.unwrap(); // 42
```

#### `inspectErr(op: (error: E) => void): Result<T, E>`

Calls the provided closure with a reference to the contained error if `Err`.

```typescript
let captured: string | null = null;
const result = Err('error').inspectErr(e => { captured = e; });
console.log(captured); // 'error'
result.unwrapErr(); // 'error'
```

## Real-world Example

```typescript
import { Ok, Err, Result } from '@lei.wei/rs-result';

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return Err('Division by zero');
  }
  return Ok(a / b);
}

function parseNumber(str: string): Result<number, string> {
  const num = Number(str);
  if (isNaN(num)) {
    return Err('Invalid number');
  }
  return Ok(num);
}

// Chaining operations
const result = parseNumber('10')
  .andThen(n => divide(n, 2))
  .map(x => x * 3);

if (result.isOk()) {
  console.log('Result:', result.unwrap()); // 15
} else {
  console.log('Error:', result.unwrapErr());
}

// Error handling
const errorResult = parseNumber('abc')
  .andThen(n => divide(n, 2))
  .map(x => x * 3);

if (errorResult.isErr()) {
  console.log('Error:', errorResult.unwrapErr()); // 'Invalid number'
}
```

## Error Handling Patterns

### Providing Fallback Values

```typescript
const result = Ok(42).unwrapOr(0); // 42
const fallback = Err('error').unwrapOr(0); // 0
```

### Transforming Errors

```typescript
const result = Err('network error')
  .mapErr(e => `Failed: ${e}`)
  .unwrapErr(); // 'Failed: network error'
```

### Chaining Multiple Operations

```typescript
const result = Ok(5)
  .andThen(x => Ok(x * 2))
  .andThen(x => Ok(x + 1))
  .map(x => x.toString()); // Ok('11')
```

## TypeScript Integration

The library provides full TypeScript support with proper type inference:

```typescript
const success = Ok<number, string>(42);
const failure = Err<number, string>('error');

// Type is inferred correctly
if (success.isOk()) {
  const value: number = success.unwrap();
}

// Generic operations preserve types
const doubled = success.map(x => x * 2); // Result<number, string>
```

## Comparison with Try/Catch

| Try/Catch | Result |
|-----------|--------|
| Exceptions can be easily forgotten | Errors must be explicitly handled |
| Type information is lost in caught errors | Errors are strongly typed |
| Hard to chain operations | Easy to compose with `andThen`, `map` |
| Performance overhead of exceptions | No exception handling overhead |

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Inspired by Rust's `std::result::Result` type
- Built with TypeScript and Rollup
