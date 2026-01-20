import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { EditorBubble } from "./editor-bubble";

const useCurrentEditorMock = vi.fn();
let lastBubbleProps: any;

vi.mock("@tiptap/react", () => ({
  useCurrentEditor: () => useCurrentEditorMock(),
}));

vi.mock("@tiptap/react/menus", () => ({
  BubbleMenu: (props: Record<string, unknown>) => {
    lastBubbleProps = props;
    return <div data-testid="bubble" />;
  },
}));

describe("EditorBubble", () => {
  it("returns null when editor is missing", () => {
    useCurrentEditorMock.mockReturnValue({ editor: null });
    const { container } = render(<EditorBubble>Bubble</EditorBubble>);
    expect(container.firstChild).toBeNull();
  });

  it("applies default shouldShow logic", () => {
    const editor = { isEditable: true, isActive: () => false };
    useCurrentEditorMock.mockReturnValue({ editor });
    render(<EditorBubble>Bubble</EditorBubble>);

    const shouldShow = lastBubbleProps.shouldShow as (args: any) => boolean;
    const state = { selection: { empty: false } };

    expect(shouldShow({ editor, state, from: 0, to: 0 })).toBe(true);
    expect(shouldShow({ editor: { ...editor, isEditable: false }, state, from: 0, to: 0 })).toBe(false);
    expect(shouldShow({ editor, state: { selection: { empty: true } }, from: 0, to: 0 })).toBe(false);
    expect(shouldShow({ editor: { ...editor, isActive: () => true }, state, from: 0, to: 0 })).toBe(false);
  });
});
