import { parseRecFunc } from "tiny-ts-parser";
import { expect } from "@std/expect";
import { typecheck } from "./recfunc.ts";

Deno.test("typecheck recursive function", () => {
  const actual = typecheck(
    parseRecFunc("function f(x: number): number { return f(x); } f"),
    {},
  );
  if (actual.tag !== "Func") {
    throw new Error("Expected Func");
  }
  expect(actual.params[0].name).toBe("x");
  expect(actual.params[0].type.tag).toBe("Number");
  expect(actual.retType.tag).toBe("Number");
});

Deno.test("typecheck recursive function call", () => {
  const actual = typecheck(
    parseRecFunc("function f(x: number): number { return f(x); } f(0)"),
    {},
  );
  expect(actual.tag).toBe("Number");
});
