import { render } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { EditorBubble } from "./editor-bubble";

const useCurrentEditorMock = vi.fn();
type BubbleMenuProps = {
  shouldShow: (args: {
    editor: { isEditable: boolean; isActive: (name: string) => boolean };
    state: { selection: { empty: boolean } };
    from: number;
    to: number;
  }) => boolean;
};
let lastBubbleProps: BubbleMenuProps | null = null;

vi.mock("@tiptap/react", () => ({
  useCurrentEditor: () => useCurrentEditorMock(),
}));

vi.mock("@tiptap/react/menus", () => ({
  BubbleMenu: (props: BubbleMenuProps) => {
    lastBubbleProps = props;
    return (
      <React.Fragment>
        <div data-testid="bubble" />
      </React.Fragment>
    );
  },
}));

describe("EditorBubble", () => {
  it("returns null when editor is missing", () => {
    useCurrentEditorMock.mockReturnValue({ editor: null });
    const { container } = render(<EditorBubble>Bubble</EditorBubble>);
    expect(container.firstChild).toBeNull();
  });

  it("applies default shouldShow logic", () => {
    const editor = { isEditable: true, isActive: (_name: string) => false };
    useCurrentEditorMock.mockReturnValue({ editor });
    render(<EditorBubble>Bubble</EditorBubble>);

    if (!lastBubbleProps) {
      throw new Error("BubbleMenu props missing");
    }
    const shouldShow = lastBubbleProps.shouldShow;
    const state = { selection: { empty: false } };

    expect(shouldShow({ editor, state, from: 0, to: 0 })).toBe(true);
    expect(shouldShow({ editor: { ...editor, isEditable: false }, state, from: 0, to: 0 })).toBe(false);
    expect(shouldShow({ editor, state: { selection: { empty: true } }, from: 0, to: 0 })).toBe(false);
    expect(shouldShow({ editor: { ...editor, isActive: () => true }, state, from: 0, to: 0 })).toBe(false);
  });
});
