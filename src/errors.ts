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
 * Error thrown when attempting to unwrap a missing value on either side of an Either jonad.
 */
export class GetValueError extends JonadsError {
    /**
     * Constructs a new GetValueError.
     * @param side The side of the Either jonad that was missing a value.
     */
    constructor(side: "left" | "right") {
        super("Attempted to unwrap a missing " + side + " value");
    }
}
