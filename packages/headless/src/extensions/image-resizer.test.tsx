import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { ImageResizer } from "./image-resizer";

const useCurrentEditorMock = vi.fn();
let moveableProps: any;

vi.mock("@tiptap/react", () => ({
  useCurrentEditor: () => useCurrentEditorMock(),
}));

vi.mock("react-moveable", () => ({
  default: (props: Record<string, unknown>) => {
    moveableProps = props;
    return <div data-testid="moveable" />;
  },
}));

describe("ImageResizer", () => {
  it("returns null when no active image", () => {
    useCurrentEditorMock.mockReturnValue({ editor: { isActive: () => false } });
    const { container } = render(<ImageResizer />);
    expect(container.firstChild).toBeNull();
  });

  it("updates image size on resize end", () => {
    const setImage = vi.fn(() => true);
    const setNodeSelection = vi.fn();
    const editor = {
      isActive: () => true,
      state: { selection: { from: 1 } },
      commands: { setImage, setNodeSelection },
    };

    const image = document.createElement("img");
    image.className = "ProseMirror-selectednode";
    image.src = "https://example.com/image.png";
    image.style.width = "100px";
    image.style.height = "200px";
    document.body.appendChild(image);

    useCurrentEditorMock.mockReturnValue({ editor });
    render(<ImageResizer />);

    moveableProps.onResize?.({
      target: image,
      width: 150,
      height: 250,
      delta: [1, 1],
    });
    expect(image.style.width).toBe("150px");
    expect(image.style.height).toBe("250px");

    moveableProps.onScale?.({
      target: image,
      transform: "scale(1.1)",
    });
    expect(image.style.transform).toBe("scale(1.1)");

    moveableProps.onResizeEnd?.();

    expect(setImage).toHaveBeenCalledWith({
      src: image.src,
      width: 150,
      height: 250,
    });
    expect(setNodeSelection).toHaveBeenCalledWith(1);

    image.remove();
  });
});
