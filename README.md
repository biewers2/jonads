# J(avascript M)onads

A set of monadic classes ("Jonads") and utilities for writing clean, programmatically correct code.

## Jonads List

Jonads are simply Javascript classes that use inheritence and Typescript interfaces to create monadic structures for
implementing safety in error-prone code.

### Either

Either left or right. This Jonad represents one of two possible values. It is the base type of others that are similar
to it, such as `Result`.

There are two concrete types `Left` and `Right` that can be initialized like any other Javascript class, but implement
the `Either` interface. This jonad is useful for representing a single value that can be of two different variants, but
come with type-safety measure through the utility functions defined by the interface they implement.

#### Examples

Working with values using `Either`.
_(Code is in javascript, but annotated with Typescript types)_

```javascript
let numericValue; // Either<number, string>

numericValue = new Left(3);
console.log(numericValue.isLeft());
// => true
console.log(numericValue.leftOr(right => parseInt(right)));
// => 3

// ...

numericValue = new Right("5");
console.log(numericValue.isRight());
// => true
console.log(numericValue.leftOr(right => parseInt(right)));
// => 5
```

### Result

Result represents a value or an error that can be associated with an attempt to resolve the value.

This is a subtype of `Either`, so it also has two concrete classes: `Ok` and `Err`.

#### Examples

Working with values using `Result`.
_(Code is in javascript, but annotated with Typescript types)_

```javascript
// getUser(id: number): Result<User, GetUserError>
function getUser(id) {
    try {
        const user = db.find(id);
        return Ok(user);
    } catch (e) {
        return Err(new GetUserError(`failed to get user: ${e.message}`))
    }
}

let result; // Result<User, GetUserError>

result = getUser(1);
console.log(result.isOk());
// => true
const newResult = result.map(user => user.name);
console.log(newResult);
// => Ok("John")

// ...

result = getUser(-1).map(user => user.name);
console.log(result.isErr());
// => true
const name = result.valueOr("unknown");
console.log(name);
// => "unknown"
```

## Working with Jonads

Jonads are useful as they exist in their concrete class forms, but they can be tedious to work with if a set of utility
functions aren't supplied.

### "Do-notation" and Results

There's a concept in Haskell called "do-notation". Effectively, this notation allows Haskell to extract the side-effects
from function/service calls (for us, `Err` in a `Result`) and focus primarily on the happy-path values.

To recreate this notation, the `jDo` function can be used to run a sequence of services that return "results".
By calling this function at the top of any function, and passing the actual function logic to it through a callback, `jDo`
can capture any thrown errors into `Err` values and allow you, the developer, to extract the side-effects away from the function's
logic via a call to the provided `bind` function.

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
const getUserWorkspaceName = (userId) => jDo(bind => {
    const user = bind(getUser(userId));
    const workspace = bind(getWorkspace(user.workspaceId));
    return workspace.name
});
```

Although `jDo` captures any thrown exceptions in a `Result` as `Err`s, there may be simpler cases where you would only
want to capture specific (or any) execption from a single function call that may not return a result. You can do this
using `jTry` and `jTryCatching`.

```javascript
class NonSingleDigitError extends Error {}

function onlySingleDigit(value) {
    if (value < -9 || value > 9) {
        throw new NonSingleDigitError();
    } else {
        return value;
    }
}

console.log(jTry(() => onlySingleDigit(3)));
// => Ok(3)

console.log(jTry(() => onlySingleDigit(10)));
// => Err(NonSingleDigitError)

// ...

class NegativeNumberError extends Error {}

console.log(jTryCatching([NegativeNumberError], () => onlySingleDigit(-10)));
// throws `NonSingleDigitError`.
```
