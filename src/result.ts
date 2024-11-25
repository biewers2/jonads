import { Either, Left, Right } from "./either";

export interface Result<V, E extends Error> extends Either<V, E> {
    isOk: () => boolean;

    isErr: () => boolean;

    okOr: (fallback: V | ((right: E) => V)) => V;

    map: <T>(mapper: (value: V) => T) => Result<T, E>;

    mapErr: <T extends Error>(mapper: (error: E) => T) => Result<V, T>;
}

export class Ok<V, E extends Error> extends Left<V, E> implements Result<V, E> {
    constructor(value: V) {
        super(value);
    }

    isOk(): boolean {
        return this.isLeft();
    }

    isErr(): boolean {
        return this.isRight();
    }

    okOr(fallback: V | ((error: E) => V)): V {
        return this.leftOr(fallback);
    }

    map<T>(mapper: (value: V) => T): Result<T, E> {
        return new Ok(mapper(this.value));
    }

    mapErr<T extends Error>(mapper: (error: E) => T): Result<V, T> {
        return new Ok(this.value);
    }
}

export class Err<V, E extends Error> extends Right<V, E> implements Result<V, E> {
    constructor(value: E) {
        super(value);
    }

    isOk(): boolean {
        return this.isLeft();
    }

    isErr(): boolean {
        return this.isRight();
    }

    okOr(fallback: V | ((right: E) => V)): V {
        return this.leftOr(fallback);
    }

    map<T>(mapper: (value: V) => T): Result<T, E> {
        return new Err(this.value);
    }

    mapErr<T extends Error>(mapper: (error: E) => T): Result<V, T> {
        return new Err(mapper(this.value));
    }
}
