import { describe, expect, it, vi } from "vitest";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { Mathematics } from "./mathematics";

type MathematicsExtension = {
  config: {
    addNodeView: () => (args: {
      node: { attrs: { latex: string }; nodeSize: number };
      HTMLAttributes: Record<string, string>;
      getPos: () => number | string;
      editor: { isEditable: boolean; commands: { setTextSelection: (pos: number) => void } };
    }) => { dom: HTMLElement };
  };
};

describe("Mathematics", () => {
  it("inserts and removes latex", () => {
    const editor = new Editor({
      element: null,
      extensions: [StarterKit, Mathematics],
      content: "Hello",
    });

    editor.commands.setTextSelection({ from: 1, to: 6 });
    const inserted = editor.commands.setLatex({ latex: "x^2" });
    expect(inserted).toBe(true);
    expect(editor.getText()).toContain("x^2");

    const unset = editor.commands.unsetLatex();
    expect(unset).toBe(true);
    expect(editor.getText()).toContain("x^2");

    editor.destroy();
  });

  it("renders html with data-type and text", () => {
    const editor = new Editor({
      element: null,
      extensions: [StarterKit, Mathematics],
      content: "y",
    });

    editor.commands.setTextSelection({ from: 1, to: 2 });
    editor.commands.setLatex({ latex: "y" });
    const html = editor.getHTML();

    expect(html).toContain('data-type="math"');
    expect(html).toContain("y");
    editor.destroy();
  });

  it("skips insertion when shouldRender returns false", () => {
    const editor = new Editor({
      element: null,
      extensions: [StarterKit, Mathematics.configure({ shouldRender: () => false })],
      content: "Hello",
    });

    editor.commands.setTextSelection({ from: 1, to: 2 });
    const inserted = editor.commands.setLatex({ latex: "z" });
    expect(inserted).toBe(false);
    editor.destroy();
  });

  it("creates a node view for math", () => {
    const extension = Mathematics.configure({
      HTMLAttributes: { "data-option": "value" },
    }) as unknown as MathematicsExtension;
    const nodeViewFactory = extension.config.addNodeView.call(extension);
    const setTextSelection = vi.fn();

    const view = nodeViewFactory({
      node: { attrs: { latex: "x" }, nodeSize: 2 },
      HTMLAttributes: { "data-test": "math" },
      getPos: () => 1,
      editor: { isEditable: true, commands: { setTextSelection } },
    });

    expect(view.dom.tagName).toBe("SPAN");
    expect(view.dom.getAttribute("data-test")).toBe("math");
    expect(view.dom.getAttribute("data-option")).toBe("value");
    expect(view.dom.innerHTML).toContain("x");

    view.dom.dispatchEvent(new MouseEvent("click"));
    expect(setTextSelection).toHaveBeenCalled();
  });

  it("skips click selection when editor is not editable", () => {
    const extension = Mathematics.configure({}) as unknown as MathematicsExtension;
    const nodeViewFactory = extension.config.addNodeView.call(extension);
    const setTextSelection = vi.fn();

    const view = nodeViewFactory({
      node: { attrs: { latex: "x" }, nodeSize: 2 },
      HTMLAttributes: {},
      getPos: () => 1,
      editor: { isEditable: false, commands: { setTextSelection } },
    });

    view.dom.dispatchEvent(new MouseEvent("click"));
    expect(setTextSelection).not.toHaveBeenCalled();
  });

  it("skips click selection when getPos returns non-number", () => {
    const extension = Mathematics.configure({}) as unknown as MathematicsExtension;
    const nodeViewFactory = extension.config.addNodeView.call(extension);
    const setTextSelection = vi.fn();

    const view = nodeViewFactory({
      node: { attrs: { latex: "x" }, nodeSize: 2 },
      HTMLAttributes: {},
      getPos: () => "nope",
      editor: { isEditable: true, commands: { setTextSelection } },
    });

    view.dom.dispatchEvent(new MouseEvent("click"));
    expect(setTextSelection).not.toHaveBeenCalled();
  });

  it("returns false when unsetLatex has no string", () => {
    const editor = new Editor({
      element: null,
      extensions: [StarterKit, Mathematics],
      content: "Hello",
    });

    const result = editor.commands.unsetLatex();
    expect(result).toBe(false);
    editor.destroy();
  });

  it("does not insert when latex is empty", () => {
    const editor = new Editor({
      element: null,
      extensions: [StarterKit, Mathematics],
      content: "Hello",
    });

    editor.commands.setTextSelection({ from: 1, to: 2 });
    const result = editor.commands.setLatex({ latex: "" });
    expect(result).toBe(false);
    editor.destroy();
  });
});
