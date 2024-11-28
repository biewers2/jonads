/**
 * Parent error class for all of Jonads' errors
 */
export class JonadsError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

/**
 * Runtime error thrown when attempting to get/unwrap the wrong side of an Either jonad.
 * 
 * @example
 * const maybeNumber = Option.from(null);
 * maybeNumber.getLeftOrThrow();
 * // => GetValueErorr: Attempted to get the left value, but it was missing
 */
export class GetValueError extends JonadsError {
    /**
     * Constructs a new GetValueError.
     * 
     * @param side The side of the Either jonad that was missing a value.
     */
    constructor(side: "left" | "right") {
        super("Attempted to get the " + side + " value, but it was missing");
    }
}
