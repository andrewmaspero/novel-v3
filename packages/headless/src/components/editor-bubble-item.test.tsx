import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { EditorBubbleItem } from "./editor-bubble-item";

const useCurrentEditorMock = vi.fn();

vi.mock("@tiptap/react", () => ({
  useCurrentEditor: () => useCurrentEditorMock(),
}));

describe("EditorBubbleItem", () => {
  it("returns null without editor", () => {
    useCurrentEditorMock.mockReturnValue({ editor: null });
    const { container } = render(<EditorBubbleItem>Item</EditorBubbleItem>);
    expect(container.firstChild).toBeNull();
  });

  it("calls onSelect with editor", () => {
    const editor = { id: "editor" };
    useCurrentEditorMock.mockReturnValue({ editor });
    const onSelect = vi.fn();

    render(<EditorBubbleItem onSelect={onSelect}>Item</EditorBubbleItem>);
    fireEvent.click(screen.getByRole("button"));
    expect(onSelect).toHaveBeenCalledWith(editor);
  });

  it("supports asChild without nesting buttons", () => {
    const editor = { id: "editor" };
    useCurrentEditorMock.mockReturnValue({ editor });
    const onSelect = vi.fn();

    const { container } = render(
      <EditorBubbleItem asChild onSelect={onSelect}>
        <button type="button">Child</button>
      </EditorBubbleItem>,
    );

    const buttons = container.querySelectorAll("button");
    expect(buttons).toHaveLength(1);
    fireEvent.click(buttons[0]);
    expect(onSelect).toHaveBeenCalledWith(editor);
  });
});
