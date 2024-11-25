export class JonadError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class GetValueError extends JonadError {
    constructor(side: "left" | "right") {
        super("Attempted to unwrap a missing " + side + " value");
    }
}
