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

Deno.test("typecheck function with params is function", () => {
  const actual = typecheck(parseBasic("(f: (x:number) => number) => 1"), {});
  expect(actual.tag).toBe("Func");
  expect(actual.params[0].name).toBe("f");
  expect(actual.params[0].type.tag).toBe("Func");
  expect(actual.retType.tag).toBe("Number");
});

Deno.test("typecheck invalid function with undefined param", () => {
  expect(() => typecheck(parseBasic("(x: number) => y"), {})).toThrow();
});

Deno.test("typecheck IIFE", () => {
  const actual = typecheck(parseBasic("((x: number) => x)(42)"), {});
  expect(actual.tag).toBe("Number");
});

Deno.test("typecheck invalid IIFE with invalid arg type", () => {
  expect(() => typecheck(parseBasic("((x: number) => x )(true)"), {}))
    .toThrow();
});

Deno.test("typecheck IIFE with invalid args", () => {
  expect(() => typecheck(parseBasic("((x: number) => 42)(1,2,3)"), {}))
    .toThrow();
});

Deno.test("typecheck sequential", () => {
  const input = `
  const add = (x: number, y: number) => x + y;
  const select = (b: boolean, x: number, y: number) => b ? x : y;
  const x = add(1, add(2, 3));
  const y = select(true, x, x);
  y;
  `;
  const actual = typecheck(parseBasic(input), {});
  expect(actual.tag).toBe("Number");
});
