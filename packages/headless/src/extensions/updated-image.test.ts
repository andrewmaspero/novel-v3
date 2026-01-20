import { describe, expect, it } from "vitest";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import UpdatedImage from "./updated-image";

describe("UpdatedImage", () => {
  it("supports width and height attributes", () => {
    const editor = new Editor({
      element: null,
      extensions: [StarterKit, UpdatedImage],
      content: "",
    });

    const inserted = editor.commands.setImage({
      src: "https://example.com/image.png",
      width: 320,
      height: 240,
    });

    expect(inserted).toBe(true);
    expect(editor.getAttributes("image").width).toBe(320);
    expect(editor.getAttributes("image").height).toBe(240);

    editor.destroy();
  });
});
