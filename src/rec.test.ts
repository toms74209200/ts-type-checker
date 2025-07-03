import { expect } from "@std/expect";
import { parseRec } from "tiny-ts-parser";
import { simplifyType } from "./rec.ts";

Deno.test("simplifyType", () => {
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

  const result = simplifyType(actual.params[0].type);

  expect(result.tag).toBe("Object");
  if (result.tag !== "Object") {
    throw new Error("Expected Object type");
  }
  expect(result.props[0].name).toBe("foo");
  expect(result.props[0].type.tag).toBe("Rec");
  if (result.props[0].type.tag !== "Rec") {
    throw new Error("Expected Rec type");
  }
  expect(result.props[0].type.name).toBe("X");
  expect(result.props[0].type.type.tag).toBe("Object");
  if (result.props[0].type.type.tag !== "Object") {
    throw new Error("Expected Object type");
  }
  expect(result.props[0].type.type.props).toContainEqual({
    name: "foo",
    type: { tag: "TypeVar", name: "X" },
  });
});
