# J(avascript M)onads

A set of monadic classes ("Jonads") and utilities for writing clean, programmatically correct code.

* [Jonads Documentation](https://biewers2.github.io/jonads/)
* [Jonads Repository](https://github.com/biewers2/jonads)
* [NPM Package](https://www.npmjs.com/package/jonads)

## List of Jonads

Jonads are Javascript classes that implement Typescript interfaces to create monadic structures for
creating safe, idiomatic code.

### Either

Either left or right. This Jonad represents one of two possible values. It is the base type of other Jonads, such as
`Result` and `Option`.

There are two concrete types `Left` and `Right` that implement the `Either` interface. Like all other jonads, these
classes aren't exposed in this package, but can be created through calls to the related `Either` const object. See the
examples below for how to do this. This jonad is useful for representing a single value that can be of two different
variants, but come with type-safety measure through the utility functions defined by the interface.

#### Examples

Instantiating `Either` using the provided const object:

```typescript
const lefty: Either<number, string> = Either.left(3);
const righty: Either<number, string> = Either.right("5");

console.log(lefty.isLeft());
// => true
console.log(right.isRight());
// => true
```

Working with values using `Either`.

```typescript
let numbery: Either<number, string>;

numbery = Either.left(3);
console.log(numbery.isLeft());
// => true
console.log(numbery.leftOr(s => parseInt(s)));
// => 3

// ...

numbery = Either.right("5");
console.log(numbery.isRight());
// => true
console.log(numbery.leftOr(s => parseInt(s)));
// => 5
```

### Result

Result represents a value or an error that can be associated with an attempt to resolve the value. This is a subtype
of `Either`, and also has two implicit concrete classes: `Ok` representing any value and `Err` representing an error
that occurred during the attempt to resolve the value.

#### Examples

Instantiating `Result` using the provided const object:

```typescript
const okish: Result<string, Error> = Result.ok("I'm ok!");
const errish: Result<string, Error> = Result.err(new Error("I'm not ok!"));

console.log(okish.isOk());
// => true
console.log(errish.isErr());
// => true
```

Working with values using `Result`.

```typescript
// async function safeFetch(url: string): Promise<Result<Response, HttpError>>

// When the fetch is successful...

const result: Result<Response, HttpError> = await safeFetch("https://example.com/api/data");
console.log(result.isOk());
// => true

const body: Result<object, HttpError> = await result.mapAsync(async response => await response.json());
console.log(body.valueOr({}));
// => { data: "..." }

// ...when the fetch is not successful...

const result: Result<Response, HttpError> = await safeFetch("https://example.com/api/data");
console.log(result.isErr());

const body: Result<object, HttpError> = await result.mapAsync(async response => await response.json());
console.log(body.valueOr({}));
// => {}
```

### Option

Option represents a value that may or may not exist. This is a subtype of `Either`, and also has two implicit concrete
classes: `Some` representing the existence of a value and `None` representing the absence of a value.

#### Examples

Instantiating `Option` using the provided const object:

```typescript
const something: Option<string> = Option.from("I'm ok!");
const nothing: Option<string> = Option.none();
// or, if you have a potentially nullable/undefined value...
const maybe: Option<string> = Option.from(getNullableValue());

console.log(something.isSome());
// => true
console.log(nothing.isNone());
// => true
```

Working with values using `Option`.

```typescript
const stack: string[] = ["a"];

let nextValue: Option<string> = Option.from(stack.pop());
console.log(nextValue.isSome());
// => true

nextValue = Option.from(stack.pop());
console.log(nextValue.isNone());
// => true
```

## Working with Jonads

Jonads are useful as they exist in their concrete class forms, but they can be tedious to work with if a set of utility
functions aren't supplied.

### "Do-notation" and Results

There's a concept in Haskell called "do-notation". Effectively, this notation allows Haskell to extract the side-effects
from function/service calls (for us, `Err` in a `Result`) and focus primarily on the happy-path values.

To recreate this notation, the `doing` function can be used to run a sequence of services (fallible functions).
By calling this function at the top of any function, and passing the actual function logic to it through a callback,
`doing` can capture any thrown errors into `Err` values and allow you, the developer, to extract the side-effects
away from the function's logic via a call to the provided `bind` function.

#### Examples

Let's say you want to define a new service to get the name of a workspace a user is associated with.

You already have two services defined to get the User and Workspace records by ID. These database calls can fail for
numerous reasons, but the new service you're trying to define has no concern with handling errors and wants to
propagate them to the caller.

```javascript
// Existing services:
//   getUser(id: number): Result<User, GetUserError>
//   getWorkspace(id: number): Result<Workspace, GetWorkspaceError>

// getUserWorkspaceName(userId: number): Result<string, DatabaseError>
const getUserWorkspaceName = (userId) => doing(bind => {
    const user = bind(getUser(userId));
    const workspace = bind(getWorkspace(user.workspaceId));
    return workspace.name
});
```

Although `doing` captures any thrown exceptions in a `Result` as `Err`s, there may be simpler cases where you would only
want to capture specific (or any) execption from a single function call that may not return a result. You can do this
using `trying` and `tryCatching`.

```javascript
const result: Result<Response, Error> = await tryingAsync(async () => await fetch("https://example.com"));
console.log(result.isOk());
// => true

result.matchAsync(
    res => console.log(await res.json()),
    err => console.error(err),
);
// => { data: "..." }
```
