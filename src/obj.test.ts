import { parseObj } from "tiny-ts-parser";
import { expect } from "@std/expect";
import { typecheck } from "./obj.ts";

Deno.test("typecheck object", () => {
  const input = `
    const x = { foo: 1, bar: true };
    x.foo;`;
  const actual = typecheck(parseObj(input), {});
  expect(actual.tag).toBe("Number");
});
