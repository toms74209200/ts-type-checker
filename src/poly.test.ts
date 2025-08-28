import { expect } from "@std/expect/expect";
import { subst, typecheck, typeEqSub } from "./poly.ts";
import { parsePoly, typeShow } from "tiny-ts-parser";

Deno.test("subst", () => {
  const actual = subst(
    {
      tag: "Func",
      params: [
        { name: "x", type: { tag: "TypeVar", name: "T" } },
      ],
      retType: { tag: "TypeVar", name: "T" },
    },
    "T",
    { tag: "Number" },
  );
  expect(actual.tag).toBe("Func");
  if (actual.tag !== "Func") {
    throw new Error("Expected Func type");
  }
  expect(actual.params[0].name).toBe("x");
  expect(actual.params[0].type.tag).toBe("Number");
  if (actual.params[0].type.tag !== "Number") {
    throw new Error("Expected Number type");
  }
  expect(actual.retType.tag).toBe("Number");
});

Deno.test("typeEqSub", () => {
  const ty1 = {
    tag: "TypeAbs" as const,
    typeParams: ["A"],
    type: {
      tag: "Func" as const,
      params: [
        { name: "x", type: { tag: "TypeVar" as const, name: "A" } },
      ],
      retType: { tag: "TypeVar" as const, name: "A" },
    },
  };
  const ty2 = {
    tag: "TypeAbs" as const,
    typeParams: ["B"],
    type: {
      tag: "Func" as const,
      params: [
        { name: "x", type: { tag: "TypeVar" as const, name: "B" } },
      ],
      retType: { tag: "TypeVar" as const, name: "B" },
    },
  };

  expect(typeEqSub(ty1, ty2, {})).toBeTruthy();
});

Deno.test("typecheck generics", () => {
  const input = `const f = <T>(x: T) => x;
  f`;

  expect(typeShow(typecheck(parsePoly(input), {}, []))).toBe("<T>(x: T) => T");
});

Deno.test("typecheck generics annotated type", () => {
  const input = `const f = <T>(x: T) => x;
  f<number>`;

  expect(typeShow(typecheck(parsePoly(input), {}, []))).toBe(
    "(x: number) => number",
  );
});

Deno.test("typecheck generics annotated select number", () => {
  const input =
    `const select = <T>(cond: boolean, a: T, b: T) => (cond ? a : b);
    const selectNumber = select<number>;
    selectNumber;`;

  expect(typeShow(typecheck(parsePoly(input), {}, []))).toBe(
    "(cond: boolean, a: number, b: number) => number",
  );
});

Deno.test("typecheck generics annotated select boolean", () => {
  const input =
    `const select = <T>(cond: boolean, a: T, b: T) => (cond ? a : b);
    const selectBoolean = select<boolean>;
    selectBoolean;`;
  expect(typeShow(typecheck(parsePoly(input), {}, []))).toBe(
    "(cond: boolean, a: boolean, b: boolean) => boolean",
  );
});

Deno.test("typecheck generics shadowing", () => {
  const input = `const foo = <T>(arg1: T, arg2: <T>(x: T) => boolean) => true;
  foo<number>`;
  expect(typeShow(typecheck(parsePoly(input), {}, []))).toBe(
    "(arg1: number, arg2: <T>(x: T) => boolean) => boolean",
  );
});

Deno.test("typecheck generics capture", () => {
  const input =
    `const foo = <T>(arg1: T, arg2: <U>(x: T, y: U) => boolean) => true;
    const bar = <U>() => foo<U>;`;

  expect(typeShow(typecheck(parsePoly(input), {}, []))).toBe(
    "<U>() => (arg1: U, arg2: <U@1>(x: U, y: U@1) => boolean) => boolean",
  );
});
