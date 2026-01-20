import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { EditorCommandItem } from "./editor-command-item";
import { EditorRoot } from "./editor";
import { novelStore } from "../utils/store";
import { rangeAtom } from "../utils/atoms";

const useCurrentEditorMock = vi.fn();

vi.mock("@tiptap/react", () => ({
  useCurrentEditor: () => useCurrentEditorMock(),
}));

vi.mock("cmdk", () => ({
  Command: Object.assign(
    ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    {
      Input: ({ onValueChange, value, ...rest }: Record<string, unknown>) => (
        <input
          value={value as string | number | readonly string[] | undefined}
          onChange={(event) => (onValueChange as ((next: string) => void) | undefined)?.(event.currentTarget.value)}
          readOnly={!onValueChange}
          {...rest}
        />
      ),
      List: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    },
  ),
  CommandItem: ({ children, onSelect }: { children: React.ReactNode; onSelect: () => void }) => (
    <div data-testid="command-item" onClick={() => onSelect()}>
      {children}
    </div>
  ),
  CommandEmpty: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("EditorCommandItem", () => {
  it("returns null without editor", () => {
    useCurrentEditorMock.mockReturnValue({ editor: null });
    const { container } = render(
      <EditorRoot>
        <EditorCommandItem onCommand={() => {}}>Item</EditorCommandItem>
      </EditorRoot>,
    );

    expect(container.firstChild).toBeNull();
  });

  it("invokes onCommand with editor and range", () => {
    const editor = { id: "editor" };
    useCurrentEditorMock.mockReturnValue({ editor });
    novelStore.set(rangeAtom, { from: 1, to: 2 });

    const onCommand = vi.fn();
    render(
      <EditorRoot>
        <EditorCommandItem onCommand={onCommand}>Item</EditorCommandItem>
      </EditorRoot>,
    );

    fireEvent.click(screen.getByTestId("command-item"));
    expect(onCommand).toHaveBeenCalledWith({ editor, range: { from: 1, to: 2 } });
  });
});
