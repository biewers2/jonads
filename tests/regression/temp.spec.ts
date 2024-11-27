import { Result, doingAsync } from "../../src/jonads";

async function fetchHtml(url: string): Promise<Result<string, Error>> {
    return doingAsync(async () => {
        const res = await fetch(url);
        const text = await res.text();
        return text;
    });
}

describe("fetchHtml()", () => {
    it("returns an Ok result with the HTML content", async () => {
        const result = await fetchHtml("https://www.google.com");

        expect(result.isOk()).toBe(true);
        expect(result.getLeftOrThrow()).toContain("<html");
    });

    it("returns an Err result with an error", async () => {
        const result = await fetchHtml("httu://test/");

        expect(result.isErr()).toBe(true);
        expect(result.getRightOrThrow().message).toEqual("fetch failed");
    });
});
