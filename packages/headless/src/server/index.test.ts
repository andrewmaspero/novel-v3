import { describe, expect, it } from "vitest";
import { renderToHTMLString, renderToMarkdown, createServerEditor, serverExtensions } from "./index";

const content = {
  type: "doc",
  content: [{ type: "paragraph", content: [{ type: "text", text: "Hello" }] }],
};

describe("server", () => {
  it("renders HTML with default server extensions", () => {
    const html = renderToHTMLString({ content });
    expect(html).toContain("<p>");
    expect(html).toContain("Hello");
  });

  it("renders HTML with custom extensions", () => {
    const html = renderToHTMLString({ content, extensions: serverExtensions });
    expect(html).toContain("Hello");
  });

  it("renders markdown with default server extensions", () => {
    const markdown = renderToMarkdown({ content });
    expect(markdown).toContain("Hello");
  });

  it("renders markdown with custom extensions", () => {
    const markdown = renderToMarkdown({ content, extensions: serverExtensions });
    expect(markdown).toContain("Hello");
  });

  it("creates a server editor with provided content", () => {
    const editor = createServerEditor({ content, extensions: serverExtensions });
    expect(editor.getText()).toBe("Hello");
    editor.destroy();
  });

  it("creates a server editor with default content", () => {
    const editor = createServerEditor({});
    expect(editor.getJSON().type).toBe("doc");
    editor.destroy();
  });
});
