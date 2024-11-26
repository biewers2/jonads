import { Either } from "./either";
import { isFunction } from "../guards";
import { GetValueError } from "../errors";

/**
 * An Either jonad with a Right value.
 */
export class Right<L, R> implements Either<L, R> {
    protected value: R;

    /**
     * Creates a new Right instance with the given value.
     * 
     * @param value The value to store in the Right instance.
     */
    constructor(value: R) {
        this.value = value;
    }

    isLeft(): boolean {
        return false;
    }

    isRight(): boolean {
        return true;
    }

    leftOr(fallback: L | ((right: R) => L)): L {
        if (isFunction(fallback)) {
            return fallback(this.value);
        } else {
            return fallback;
        }
    }

    async leftOrAsync(fallback: L | ((right: R) => Promise<L>)): Promise<L> {
        if (isFunction(fallback)) {
            return await fallback(this.value);
        } else {
            return fallback;
        }
    }

    rightOr(fallback: R | ((left: L) => R)): R {
        return this.value;
    }

    async rightOrAsync(fallback: R | ((left: L) => Promise<R>)): Promise<R> {
        return this.value;
    }

    mapLeft<T>(mapper: (value: L) => T): Either<T, R> {
        return new Right(this.value);
    }

    async mapLeftAsync<V>(mapper: (value: L) => Promise<V>): Promise<Either<V, R>> {
        return Promise.resolve(new Right(this.value));
    }

    mapRight<T>(mapper: (value: R) => T): Either<L, T> {
        return new Right(mapper(this.value));
    }

    async mapRightAsync<V>(mapper: (value: R) => Promise<V>): Promise<Either<L, V>> {
        return mapper(this.value).then(v => new Right(v));
    }

    match<T>(onLeft: (value: L) => T, onRight: (value: R) => T): T {
        return onRight(this.value);
    }

    async matchAsync<T>(onLeft: (value: L) => Promise<T>, onRight: (value: R) => Promise<T>): Promise<T> {
        return onRight(this.value);
    }

    getLeftOrThrow(): L {
        throw new GetValueError("left");
    }

    getRightOrThrow(): R {
        return this.value;
    }

    toString(): string {
        return `Right(${this.value})`;
    }
}
