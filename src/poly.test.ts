import { expect } from "@std/expect/expect";
import { subst } from "./poly.ts";

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
