import { describe, expect, it } from "vitest";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import { getAllContent, getPrevText, getSelectionText, getUrlFromString, isValidUrl } from "./index";

describe("utils", () => {
  it("validates urls", () => {
    expect(isValidUrl("https://example.com")).toBe(true);
    expect(isValidUrl("notaurl")).toBe(false);
  });

  it("parses urls from strings", () => {
    expect(getUrlFromString("example.com")).toBe("https://example.com/");
    expect(getUrlFromString("https://example.com")).toBe("https://example.com");
    expect(getUrlFromString("not a url"))
      .toBeUndefined();
    expect(getUrlFromString("example.com:abc"))
      .toBe("example.com:abc");
    expect(getUrlFromString("exa[mple].com"))
      .toBeNull();
  });

  it("returns markdown slices from editor content", () => {
    const editor = new Editor({
      element: null,
      extensions: [StarterKit, Markdown],
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              { type: "text", text: "Hello " },
              { type: "text", text: "world" },
            ],
          },
        ],
      },
    });

    const all = getAllContent(editor);
    expect(all).toContain("Hello world");

    const selection = editor.state.selection;
    editor.commands.setTextSelection({ from: selection.from, to: selection.from + 5 });
    const selectionText = getSelectionText(editor);
    expect(selectionText).toContain("Hello");

    const prevText = getPrevText(editor, 4);
    expect(prevText).toContain("Hel");

    editor.destroy();
  });
});
