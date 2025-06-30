import { expect } from "@std/expect/expect";
import { parseRec } from "tiny-ts-parser";

Deno.test("parseRecFunc", () => {
  const input = `
    type X = { foo: X };
    (arg: X) => 1;`;

  const actual = parseRec(input);
  if (actual.tag !== "func") {
    throw new Error("Expected Func");
  }
  if (actual.params[0].type.tag !== "Rec") {
    throw new Error("Expected Rec type");
  }
  expect(actual.params[0].type.name).toBe("X");
  if (actual.params[0].type.type.tag !== "Object") {
    throw new Error("Expected Object type");
  }
  expect(actual.params[0].type.type.props).toContainEqual({
    name: "foo",
    type: { tag: "TypeVar", name: "X" },
  });
});
