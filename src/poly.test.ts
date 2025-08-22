import { expect } from "@std/expect/expect";
import { subst, typeEqSub } from "./poly.ts";
import { Type } from "tiny-ts-parser";

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
