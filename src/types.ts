/**
 * A function that maps one value to another.
 */
export type Mapper<T, U> = (value: T) => U;

/**
 * An async function that maps one value to another.
 */
export type AsyncMapper<T, U> = (value: T) => Promise<U>;

/**
 * A function that produces a value.
 */
export type Producer<T> = () => T;

/**
 * An async function that produces a value.
 */
export type AsyncProducer<T> = () => Promise<T>;

/**
 * A function that consumes a value.
 */
export type Consumer<T> = (value: T) => void;

/**
 * An async function that consumes a value.
 */
export type AsyncConsumer<T> = (value: T) => Promise<void>;

/**
 * A type representing a class that extends `Error`.
 */
export type ErrorClass = { new(...args: any[]): Error };
