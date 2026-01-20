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

    const ai = editor.extensionManager.extensions.find((ext) => ext.name === "ai-highlight");
    if (!ai) {
      throw new Error("AI highlight extension missing");
    }
    const aiExtension = ai as unknown as {
      config: {
        addKeyboardShortcuts: () => Record<string, () => void>;
        addInputRules: () => unknown[];
        addPasteRules: () => unknown[];
        addAttributes: () => { color: { renderHTML: (attrs: Record<string, unknown>) => Record<string, unknown> } };
      };
    };
    editor.commands.setTextSelection({ from: 1, to: 6 });
    const shortcuts = aiExtension.config.addKeyboardShortcuts.call({ ...aiExtension, editor });
    shortcuts["Mod-Shift-h"]();
    expect(editor.isActive("ai-highlight")).toBe(true);

    const inputRules = aiExtension.config.addInputRules.call(aiExtension);
    const pasteRules = aiExtension.config.addPasteRules.call(aiExtension);
    expect(inputRules).toHaveLength(1);
    expect(pasteRules).toHaveLength(1);

    editor.commands.unsetAIHighlight();
    const attrs = aiExtension.config.addAttributes.call(aiExtension);
    expect(attrs.color.renderHTML({})).toEqual({});

    addAIHighlight(editor);
    expect(editor.getAttributes("ai-highlight").color).toBe("#c1ecf970");

    editor.destroy();
  });
});
