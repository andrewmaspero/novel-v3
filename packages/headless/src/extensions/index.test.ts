import { describe, expect, it, vi } from "vitest";
import { Editor } from "@tiptap/core";
import { HorizontalRule, clientExtensions } from "./index";
import { HorizontalRule as ServerHorizontalRule, serverExtensions } from "./server";

describe("extensions bundles", () => {
  it("includes core client extensions", () => {
    const names = clientExtensions.map((extension) => extension.name);
    expect(names).toContain("starterKit");
    expect(names).toContain("placeholder");
    expect(names).toContain("image");
  });

  it("invokes client placeholder and horizontal rule handlers", () => {
    const editor = new Editor({
      element: null,
      extensions: clientExtensions,
      content: "Hello",
    });

    const placeholder = editor.extensionManager.extensions.find((ext) => ext.name === "placeholder") as any;
    const headingText = placeholder.options.placeholder({
      node: { type: { name: "heading" }, attrs: { level: 2 } },
    });
    const paragraphText = placeholder.options.placeholder({
      node: { type: { name: "paragraph" }, attrs: {} },
    });
    expect(headingText).toBe("Heading 2");
    expect(paragraphText).toBe("Press '/' for commands");

    const horizontal = HorizontalRule as any;
    const create = vi.fn(() => ({}));
    horizontal.type = { create };
    const rules = horizontal.config.addInputRules.call(horizontal);
    expect(rules).toHaveLength(1);
    const tr = {
      insert: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      mapping: { map: (value: number) => value },
    };
    const match = ["---", "---"] as any;
    match.index = 0;
    match.input = "---";
    rules[0].handler({
      state: { tr },
      range: { from: 2, to: 4 },
      match,
      commands: {} as never,
      chain: () => ({} as never),
      can: () => ({} as never),
    });
    expect(create).toHaveBeenCalled();
    expect(tr.insert).toHaveBeenCalled();

    editor.destroy();
  });

  it("includes core server extensions", () => {
    const names = serverExtensions.map((extension) => extension.name);
    expect(names).toContain("starterKit");
    expect(names).toContain("placeholder");
    expect(names).toContain("image");
  });

  it("invokes server placeholder handler", () => {
    const editor = new Editor({
      element: null,
      extensions: serverExtensions,
      content: "Hello",
    });

    const placeholder = editor.extensionManager.extensions.find((ext) => ext.name === "placeholder") as any;
    const headingText = placeholder.options.placeholder({
      node: { type: { name: "heading" }, attrs: { level: 1 } },
    });
    expect(headingText).toBe("Heading 1");

    const paragraphText = placeholder.options.placeholder({
      node: { type: { name: "paragraph" }, attrs: {} },
    });
    expect(paragraphText).toBe("Press '/' for commands");

    const horizontal = ServerHorizontalRule as any;
    const create = vi.fn(() => ({}));
    horizontal.type = { create };
    const rules = horizontal.config.addInputRules.call(horizontal);
    expect(rules).toHaveLength(1);
    const tr = {
      insert: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      mapping: { map: (value: number) => value },
    };
    const match = ["---", "---"] as any;
    match.index = 0;
    match.input = "---";
    rules[0].handler({
      state: { tr },
      range: { from: 2, to: 4 },
      match,
      commands: {} as never,
      chain: () => ({} as never),
      can: () => ({} as never),
    });
    expect(create).toHaveBeenCalled();
    expect(tr.insert).toHaveBeenCalled();
    editor.destroy();
  });
});
