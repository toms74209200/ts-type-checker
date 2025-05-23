import { parseSub } from "tiny-ts-parser";
import { expect } from "@std/expect";
import { typecheck } from "./sub.ts";

Deno.test("typecheck subtype", () => {
  const input = `
      const f = (x: { foo: number }) => x.foo;
      const x = { foo: 1, bar: true };
      f(x);`;
  const actual = typecheck(parseSub(input), {});
  expect(actual.tag).toBe("Number");
});

Deno.test("typecheck subtype with additional properties", () => {
  const input = `
      const f = (x: { foo: { bar: number } }) => x.foo.bar;
      f({ foo: { bar: 1, baz: true } });`;
  const actual = typecheck(parseSub(input), {});
  expect(actual.tag).toBe("Number");
});

Deno.test("typecheck subtype invalid", () => {
  const input = `
      type F = () => { foo: number; bar: boolean };
      const f = (x: F) => x().bar;
      const g = () => ({ foo: 1 });
      f(g);`;
  expect(() => typecheck(parseSub(input), {})).toThrow();
});

Deno.test("typecheck subtype invalid with missing properties", () => {
  const input = `
      const f = (x: { foo: { bar: number; baz: boolean } }) => x.foo.baz;
      f({ foo: { bar: 1 } });`;
  expect(() => typecheck(parseSub(input), {})).toThrow();
});
