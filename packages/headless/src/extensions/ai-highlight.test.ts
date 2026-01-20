import { describe, expect, it } from "vitest";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { AIHighlight, addAIHighlight, removeAIHighlight, inputRegex, pasteRegex } from "./ai-highlight";

describe("AIHighlight", () => {
  it("matches input and paste regex", () => {
    expect("==test==".match(inputRegex)).toBeTruthy();
    expect("==paste==".match(pasteRegex)).toBeTruthy();
  });

  it("adds and removes highlight marks", () => {
    const editor = new Editor({
      element: null,
      extensions: [StarterKit, AIHighlight],
      content: "Hello",
    });

    editor.commands.setTextSelection({ from: 1, to: 6 });
    addAIHighlight(editor, "#fff");
    expect(editor.getAttributes("ai-highlight").color).toBe("#fff");
    expect(editor.getHTML()).toContain("data-color");

    removeAIHighlight(editor);
    expect(editor.getAttributes("ai-highlight").color).toBeUndefined();

    const ai = editor.extensionManager.extensions.find((ext) => ext.name === "ai-highlight") as any;
    editor.commands.setTextSelection({ from: 1, to: 6 });
    const shortcuts = ai.config.addKeyboardShortcuts.call({ ...ai, editor });
    shortcuts["Mod-Shift-h"]();
    expect(editor.isActive("ai-highlight")).toBe(true);

    const inputRules = ai.config.addInputRules.call(ai);
    const pasteRules = ai.config.addPasteRules.call(ai);
    expect(inputRules).toHaveLength(1);
    expect(pasteRules).toHaveLength(1);

    editor.commands.unsetAIHighlight();
    const attrs = ai.config.addAttributes.call(ai);
    expect(attrs.color.renderHTML({})).toEqual({});

    addAIHighlight(editor);
    expect(editor.getAttributes("ai-highlight").color).toBe("#c1ecf970");

    editor.destroy();
  });
});
