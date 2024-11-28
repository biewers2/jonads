import { Option } from "./option";
import { Left } from "../either/left";
import { AsyncMapper, AsyncProducer, Mapper, Producer, Result } from "../jonads";

export class Some<T> extends Left<T, null> implements Option<T> {
    constructor(value: T) {
        super(value);
    }

    isSome(): boolean {
        return true;
    }

    isNone(): boolean {
        return false;
    }

    valueOr(fallback: T | Producer<T>): T {
        return this.value;
    }

    async valueOrAsync(fallback: T | Promise<T> | AsyncProducer<T>): Promise<T> {
        return this.value;
    }

    map<U>(mapper: Mapper<T, U>): Option<U> {
        return new Some(mapper(this.value));
    }

    async mapAsync<U>(mapper: AsyncMapper<T, U>): Promise<Option<U>> {
        return new Some(await mapper(this.value));
    }

    andThen<U>(mapper: Mapper<T, Option<U>>): Option<U> {
        return mapper(this.value);
    }

    async andThenAsync<U>(mapper: AsyncMapper<T, Option<U>>): Promise<Option<U>> {
        return mapper(this.value);
    }

    okOr<E extends Error>(error: E | Producer<E>): Result<T, E> {
        return Result.ok(this.value);
    }

    async okOrAsync<E extends Error>(error: E | Promise<E> | AsyncProducer<E>): Promise<Result<T, E>> {
        return Result.ok(this.value);
    }   

    toString(): string {
        return `Some(${this.value})`;
    }
}
