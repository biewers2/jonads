import { Option } from "./option";
import { Right } from "../either/right";
import { isFunction } from "../guards";
import { AsyncMapper, AsyncProducer, Mapper, Producer, Result } from "../jonads";

export class None<T> extends Right<T, null> implements Option<T> {
    constructor(nullish: null | undefined = null) {
        super(nullish);
    }

    isSome(): boolean {
        return false;
    }

    isNone(): boolean {
        return true;
    }

    valueOr(fallback: T | Producer<T>): T {
        if (isFunction(fallback)) {
            return fallback();
        } else {
            return fallback;
        }
    }

    async valueOrAsync(fallback: T | Promise<T> | AsyncProducer<T>): Promise<T> {
        if (isFunction(fallback)) {
            return await fallback();
        } else {
            return await Promise.resolve(fallback);
        }
    }

    map<U>(mapper: Mapper<T, U>): Option<U> {
        return new None();
    }

    async mapAsync<U>(mapper: AsyncMapper<T, U>): Promise<Option<U>> {
        return new None();
    }

    andThen<U>(mapper: Mapper<T, Option<U>>): Option<U> {
        return new None();
    }

    async andThenAsync<U>(mapper: AsyncMapper<T, Option<U>>): Promise<Option<U>> {
        return new None();
    }

    okOr<E extends Error>(error: E | Producer<E>): Result<T, E> {
        if (isFunction(error)) {
            return Result.err(error());
        } else {
            return Result.err(error);
        }
    }

    async okOrAsync<E extends Error>(error: E | Promise<E> | AsyncProducer<E>): Promise<Result<T, E>> {
        if (isFunction(error)) {
            return Result.err(await error());
        } else {
            const resolvedError = await Promise.resolve(error);
            return Result.err(resolvedError);
        }
    }

    toString(): string {
        return `None`;
    }
}
