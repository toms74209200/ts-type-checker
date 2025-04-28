import { parseBasic } from "tiny-ts-parser";
import { expect } from "@std/expect";
import { typecheck } from "./basic.ts";

Deno.test("typecheck anonymous function returns number", () => {
  const actual = typecheck(parseBasic("(x: boolean) => 42"), {});
  expect(actual.tag).toBe("Func");
  expect(actual.params[0].name).toBe("x");
  expect(actual.params[0].type.tag).toBe("Boolean");
  expect(actual.retType.tag).toBe("Number");
});

Deno.test("typecheck anonymous function returns arg", () => {
  const actual = typecheck(parseBasic("(x: number) => x"), {});
  expect(actual.tag).toBe("Func");
  expect(actual.params[0].name).toBe("x");
  expect(actual.params[0].type.tag).toBe("Number");
  expect(actual.retType.tag).toBe("Number");
});

Deno.test("typecheck IIFE", () => {
  const actual = typecheck(parseBasic("((x: number) => x)(42)"), {});
  expect(actual.tag).toBe("Number");
});
