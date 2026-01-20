import { describe, expect, it } from "vitest";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { Twitter, isValidTwitterUrl, TWITTER_REGEX } from "./twitter";

describe("Twitter", () => {
  it("validates twitter urls", () => {
    expect(isValidTwitterUrl("https://x.com/user/status/123")).toBeTruthy();
    expect(isValidTwitterUrl("https://example.com"))
      .toBeNull();
    expect("https://x.com/user/status/123".match(TWITTER_REGEX)).toBeTruthy();
  });

  it("inserts tweets via command", () => {
    const editor = new Editor({
      element: null,
      extensions: [StarterKit, Twitter],
      content: "",
    });

    const inserted = editor.commands.setTweet({ src: "https://x.com/user/status/123" });
    expect(inserted).toBe(true);

    const rejected = editor.commands.setTweet({ src: "https://example.com" });
    expect(rejected).toBe(false);

    const html = editor.getHTML();
    expect(html).toContain("data-twitter");

    editor.destroy();
  });

  it("respects addPasteHandler option", () => {
    const editor = new Editor({
      element: null,
      extensions: [StarterKit, Twitter.configure({ addPasteHandler: false })],
      content: "",
    });

    const extension = editor.extensionManager.extensions.find((ext) => ext.name === "twitter") as any;
    const rules = extension.config.addPasteRules.call(extension);
    expect(rules).toHaveLength(0);

    editor.destroy();
  });

  it("adds paste rules by default", () => {
    const editor = new Editor({
      element: null,
      extensions: [StarterKit, Twitter],
      content: "",
    });

    const extension = editor.extensionManager.extensions.find((ext) => ext.name === "twitter") as any;
    const rules = extension.config.addPasteRules.call(extension);
    expect(rules.length).toBeGreaterThan(0);

    editor.destroy();
  });
});
