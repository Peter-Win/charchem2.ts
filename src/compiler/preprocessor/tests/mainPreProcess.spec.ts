import { mainPreProcess } from "../mainPreProcess";

it("MainPreProcess", () => {
  expect(mainPreProcess("")).toBe("");
  expect(mainPreProcess("no macro")).toBe("no macro");
  // first declare then use
  expect(mainPreProcess("@:MyMacro()...some text...@;@MyMacro()")).toBe(
    "...some text..."
  );
  // Simultaneous declaration and call the macro
  expect(mainPreProcess("@:MyMacro()...some text...@()")).toBe(
    "...some text..."
  );
  // The use of positional parameters
  expect(mainPreProcess("@:MyMacro(a,b)...&a...&b...@(First,Second)")).toBe(
    "...First...Second..."
  );
  // Using named parameters
  expect(mainPreProcess("@:MyMacro(a,b)...&a...&b...@(b:Second,a:First)")).toBe(
    "...First...Second..."
  );
  // Default values
  expect(
    mainPreProcess(
      "@:MyMacro(a:First,b:Second)...&a...&b...@()+@MyMacro(,Last)"
    )
  ).toBe("...First...Second...+...First...Last...");
  // Recursive calls
  expect(
    mainPreProcess("@:MyMacro(a,b)[&a...&b]@(@MyMacro(A,B),@MyMacro(C,D))")
  ).toBe("[[A...B]...[C...D]]");
});
