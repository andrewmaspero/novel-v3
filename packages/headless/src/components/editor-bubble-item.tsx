import { forwardRef } from "react";
import { useCurrentEditor } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface EditorBubbleItemProps {
  readonly children: ReactNode;
  readonly onSelect?: (editor: Editor) => void;
}

export const EditorBubbleItem = forwardRef<
  HTMLButtonElement,
  EditorBubbleItemProps & Omit<ComponentPropsWithoutRef<"button">, "onSelect">
>(({ children, onSelect, ...rest }, ref) => {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <button ref={ref} type="button" {...rest} onClick={() => onSelect?.(editor)}>
      {children}
    </button>
  );
});

EditorBubbleItem.displayName = "EditorBubbleItem";

export default EditorBubbleItem;
