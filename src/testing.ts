/**
 * Utilities for testing in ".spec" files.
 */

import { Either, Left, Right } from './either';
import { Option, Some, None } from './option';
import { Result, Ok, Err } from './result';

export function left<L, R>(value: L): Either<L, R> {
    return new Left(value);
}

export function right<L, R>(value: R): Either<L, R> {
    return new Right(value);
}

export function ok<T, E extends Error>(value: T): Result<T, E> {
    return new Ok(value);
}

export function err<T, E extends Error>(e: E): Result<T, E> {
    return new Err(e);
}

export function some<T>(value: T): Option<T> {
    return new Some(value);
}

export function none<T>(): Option<T> {
    return new None();
}
