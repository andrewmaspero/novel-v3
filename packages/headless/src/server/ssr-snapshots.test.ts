import { describe, expect, it } from "vitest";
import { renderToHTMLString, renderToMarkdown } from "./index";

const content = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Snapshot" }],
    },
    {
      type: "paragraph",
      content: [{ type: "text", text: "Hello world" }],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Item" }] }],
        },
      ],
    },
  ],
};

describe("SSR snapshots", () => {
  it("renders HTML consistently", () => {
    const html = renderToHTMLString({ content });
    expect(html).toMatchSnapshot();
  });

  it("renders Markdown consistently", () => {
    const markdown = renderToMarkdown({ content });
    expect(markdown).toMatchSnapshot();
  });
});
