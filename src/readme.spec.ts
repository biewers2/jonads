import { Either, Left, Right, Result, Ok, Err, jDo, jTry, jTryCatching } from "./index";

describe("README", () => {
    describe("Either examples", () => {
        it("passes", () => {
            let numericValue: Either<number, string>;

            numericValue = new Left(3);
            expect(numericValue.isLeft()).toBe(true);
            expect(numericValue.leftOr(right => parseInt(right))).toBe(3);

            numericValue = new Right("5");
            expect(numericValue.isRight()).toBe(true);
            expect(numericValue.leftOr(right => parseInt(right))).toBe(5);
        });
    });

    describe("Result examples", () => {
        type User = { id: number, name: string };

        class GetUserError extends Error {}

        function getUser(id: number): Result<User, GetUserError> {
            if (id > 0) {
                return new Ok({ id, name: "John Doe" });
            } else {
                return new Err(new GetUserError("Invalid user ID"));
            }
        }

        it("passes first part", () => {
            const result: Result<User, GetUserError> = getUser(1);
            expect(result.isOk()).toBe(true);

            const newResult = result.map(user => user.name);
            expect(newResult.isOk()).toBe(true);

        });

        it("passes second part", () => {
            const result: Result<string, GetUserError> = getUser(-1).map(user => user.name);
            expect(result.isErr()).toBe(true);

            const name = result.valueOr("unknown");
            expect(name).toBe("unknown");
        });
    });

    describe("jDo examples", () => {
        class DatabaseError extends Error {}
        class GetUserError extends DatabaseError {}
        class GetWorkspaceError extends DatabaseError {}

        type User = { id: number, workspaceId: number };
        type Workspace = { id: number, name: string };

        function getUser(id: number): Result<User, GetUserError> {
            if (id > 0) {
                return new Ok({ id, workspaceId: 1 });
            } else {
                return new Err(new GetUserError("Invalid user ID"));
            }
        }

        function getWorkspace(id: number): Result<Workspace, GetWorkspaceError> {
            if (id > 0) {
                return new Ok({ id, name: "My Workspace" });
            } else {
                return new Err(new GetWorkspaceError("Invalid workspace ID"));
            }
        }

        const getUserWorkspaceName = (userId: number): Result<string, DatabaseError> => jDo(bind => {
            const user = bind(getUser(userId));
            const workspace = bind(getWorkspace(user.workspaceId));
            return workspace.name
        });

        it("passes first part", () => {
            const result = getUserWorkspaceName(1);
            expect(result.isOk()).toBe(true);
            expect(result.getLeftOrThrow()).toBe("My Workspace");
        });

        it("passes second part", () => {
            const result = getUserWorkspaceName(-1);
            expect(result.isErr()).toBe(true);
            expect(result.getRightOrThrow()).toBeInstanceOf(GetUserError);
        });
    });

    describe("jTry examples", () => {
        class NonSingleDigitError extends Error {}
        class NegativeNumberError extends Error {}

        function onlySingleDigit(value: number): number {
            if (value < -9 || value > 9) {
                throw new NonSingleDigitError();
            } else {
                return value;
            }
        }

        it("passes first part", () => {
            const result = jTry(() => onlySingleDigit(3));
            expect(result.isOk()).toBe(true);
            expect(result.getLeftOrThrow()).toBe(3);
        });

        it("passes second part", () => {
            const result = jTry(() => onlySingleDigit(10));
            expect(result.isErr()).toBe(true);
            expect(result.getRightOrThrow()).toBeInstanceOf(NonSingleDigitError);
        });

        it("passes third part", () => {
            expect(() =>
                jTryCatching([NegativeNumberError], () => onlySingleDigit(-10))
            ).toThrow(NonSingleDigitError);
        });
    });
});