import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { EditorContent, EditorRoot } from "./editor";

vi.mock("@tiptap/react", () => ({
  EditorProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="editor-provider">{children}</div>
  ),
}));

describe("Editor components", () => {
  it("renders EditorRoot children", () => {
    render(
      <EditorRoot>
        <div data-testid="child" />
      </EditorRoot>,
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders EditorContent wrapper", () => {
    const { container } = render(
      <EditorContent className="editor" extensions={[]}>
        <div data-testid="content" />
      </EditorContent>,
    );

    expect(container.firstChild).toHaveClass("editor");
    expect(screen.getByTestId("editor-provider")).toBeInTheDocument();
  });
});
