import { describe, expect, it } from "vitest";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import CustomKeymap from "./custom-keymap";

describe("CustomKeymap", () => {
  it("selects text within node boundaries", () => {
    const editor = new Editor({
      element: null,
      extensions: [StarterKit, CustomKeymap],
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "Hello world" }],
          },
        ],
      },
    });

    editor.commands.setTextSelection({ from: 2, to: 4 });
    const startNodePos = editor.state.selection.$from.start();
    const endNodePos = editor.state.selection.$to.end();
    const ok = editor.commands.selectTextWithinNodeBoundaries();
    expect(ok).toBe(true);
    const { from, to } = editor.state.selection;
    expect(from).toBe(startNodePos);
    expect(to).toBe(endNodePos);

    editor.commands.setTextSelection({ from: 2, to: 4 });
    const custom = editor.extensionManager.extensions.find((ext) => ext.name === "CustomKeymap");
    if (!custom) {
      throw new Error("CustomKeymap extension missing");
    }
    const customExtension = custom as {
      config: {
        addKeyboardShortcuts: () => Record<string, (args: { editor: Editor }) => boolean>;
      };
    };
    const shortcuts = customExtension.config.addKeyboardShortcuts.call(customExtension);
    const handled = shortcuts["Mod-a"]({ editor });
    expect(handled).toBe(true);

    const handledAgain = shortcuts["Mod-a"]({ editor });
    expect(handledAgain).toBe(false);

    editor.destroy();
  });
});
