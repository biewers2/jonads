import { Either, Result, Option, doing, tryingAsync } from "../../src/jonads";

describe("README", () => {
    describe("Either examples", () => {
        test("instantiating 'Either'", () => {
            const lefty: Either<number, string> = Either.left(3);
            const righty: Either<number, string> = Either.right("5");

            expect(lefty.isLeft()).toBe(true);
            expect(righty.isRight()).toBe(true);
        });

        test("working with values using 'Either'", () => {
            let numbery: Either<number, string>;

            numbery = Either.left(3);
            expect(numbery.isLeft()).toBe(true);
            expect(numbery.leftOr(s => parseInt(s))).toBe(3);

            numbery = Either.right("5");
            expect(numbery.isRight()).toBe(true);
            expect(numbery.leftOr(s => parseInt(s))).toBe(5);
        });
    });

    describe("Result examples", () => {
        test("instantiating 'Result'", () => {
            const okish: Result<string, Error> = Result.ok("I'm ok!");
            const errish: Result<string, Error> = Result.err(new Error("I'm not ok!"));

            expect(okish.isOk()).toBe(true);
            expect(errish.isErr()).toBe(true);
        });

        test("working with values using 'Result'", async () => {
            class HttpError extends Error {}

            async function safeFetch(url: string): Promise<Result<Response, HttpError>> {
                if (url === "https://invalid.com") {
                    return Result.err(new HttpError("Invalid URL"));
                } else {
                    return Result.ok(new Response(JSON.stringify({ data: "..." })));
                }
            }

            let result: Result<Response, HttpError>;
            let body: Result<object, HttpError>;

            result = await safeFetch("https://example.com/api/data");
            expect(result.isOk()).toBe(true);

            body = await result.mapAsync(async response => await response.json());
            expect(body.valueOr({})).toEqual({ data: "..." });

            result = await safeFetch("https://invalid.com");
            expect(result.isErr()).toBe(true);

            body = await result.mapAsync(async response => await response.json());
            expect(body.valueOr({})).toEqual({});
        });
    });

    describe("Option examples", () => {
        test("instantiating 'Option'", () => {
            const something: Option<string> = Option.from("I'm here!");
            const nothing: Option<string> = Option.none();

            expect(something.isSome()).toBe(true);
            expect(nothing.isNone()).toBe(true);
        });

        test("working with values using 'Option'", () => {
            const stack: string[] = ["a"];

            let nextValue: Option<string> = Option.from(stack.pop());
            expect(nextValue.isSome()).toBe(true);

            nextValue = Option.from(stack.pop());
            expect(nextValue.isNone()).toBe(true);
        });
    });

    describe("doing examples", () => {
        class DatabaseError extends Error {}
        class GetUserError extends DatabaseError {}
        class GetWorkspaceError extends DatabaseError {}

        type User = { id: number, workspaceId: number };
        type Workspace = { id: number, name: string };

        function getUser(id: number): Result<User, GetUserError> {
            if (id > 0) {
                return Result.ok({ id, workspaceId: 1 });
            } else {
                return Result.err(new GetUserError("Invalid user ID"));
            }
        }

        function getWorkspace(id: number): Result<Workspace, GetWorkspaceError> {
            if (id > 0) {
                return Result.ok({ id, name: "My Workspace" });
            } else {
                return Result.err(new GetWorkspaceError("Invalid workspace ID"));
            }
        }

        const getUserWorkspaceName = (userId: number): Result<string, DatabaseError> => doing(bind => {
            const user = bind(getUser(userId));
            const workspace = bind(getWorkspace(user.workspaceId));
            return workspace.name
        });

        test("passes first part", () => {
            const result = getUserWorkspaceName(1);
            expect(result.isOk()).toBe(true);
            expect(result.getLeftOrThrow()).toBe("My Workspace");
        });

        test("passes second part", () => {
            const result = getUserWorkspaceName(-1);
            expect(result.isErr()).toBe(true);
            expect(result.getRightOrThrow()).toBeInstanceOf(GetUserError);
        });
    });

    describe("trying examples", () => {
        async function fakeFetch(url: string): Promise<Response> {
            return new Response(JSON.stringify({ data: "..." }));
        }

        test("using 'tryCatching'", async () => {
            const result: Result<Response, Error> = await tryingAsync(async () => await fakeFetch("https://example.com"));
            expect(result.isOk()).toBe(true);

            result.matchAsync(
                async res => expect(await res.json()).toEqual({ data: "..." }),
                async err => { throw err; } // This should not happen
            );
        });
    });
});
