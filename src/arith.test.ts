import { parseArith } from "tiny-ts-parser";
import { expect } from "@std/expect";
import { typecheck } from "./arith.ts";

Deno.test("typecheck add", () => {
  const actual = typecheck(parseArith("1 + 2"));
  expect(actual.tag).toBe("Number");
});

Deno.test("typecheck nest", () => {
  const actual = typecheck(parseArith("1 + (2 + 3)"));
  expect(actual.tag).toBe("Number");
});

Deno.test("typecheck add when different types throws error", () => {
  expect(() => typecheck(parseArith("1 + true"))).toThrow();
});

Deno.test("typecheck when cond is number throws error", () => {
  expect(() => typecheck(parseArith("1 ? 2 : 3"))).toThrow();
});

Deno.test("typecheck when then and else are not same type throws error", () => {
  expect(() => typecheck(parseArith("true ? 1 : true"))).toThrow;
});
