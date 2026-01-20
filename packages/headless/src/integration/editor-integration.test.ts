import { describe, expect, it } from "vitest";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { AIHighlight, addAIHighlight } from "../extensions/ai-highlight";
import { Mathematics } from "../extensions/mathematics";
import { Twitter } from "../extensions/twitter";
import { Command, createSuggestionItems } from "../extensions/slash-command";

const mountEditor = () => {
  const element = document.createElement("div");
  document.body.appendChild(element);
  const editor = new Editor({
    element,
    extensions: [
      StarterKit,
      AIHighlight,
      Mathematics,
      Twitter,
      Command.configure({
        suggestion: {
          items: () => createSuggestionItems([]),
        },
      }),
    ],
    content: "Hello",
  });

  return { editor, element };
};

describe("integration", () => {
  it("handles combined extensions in a real editor", () => {
    const { editor, element } = mountEditor();

    editor.commands.setTextSelection({ from: 1, to: 6 });
    addAIHighlight(editor, "#ff0");
    expect(editor.isActive("ai-highlight")).toBe(true);

    editor.commands.setTextSelection({ from: 1, to: 1 });
    const mathInserted = editor.commands.setLatex({ latex: "x^2" });
    expect(mathInserted).toBe(true);
    expect(JSON.stringify(editor.getJSON())).toContain("math");

    editor.commands.setTextSelection(editor.state.doc.content.size);
    const tweetInserted = editor.commands.setTweet({ src: "https://x.com/user/status/123" });
    expect(tweetInserted).toBe(true);

    const json = editor.getJSON();
    const content = JSON.stringify(json);
    expect(content).toContain("ai-highlight");
    expect(content).toContain("math");
    expect(content).toContain("twitter");

    editor.destroy();
    element.remove();
  });
});
