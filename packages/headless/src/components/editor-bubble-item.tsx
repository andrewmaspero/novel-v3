import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { useCurrentEditor } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface EditorBubbleItemProps {
  readonly children: ReactNode;
  readonly onSelect?: (editor: Editor) => void;
  readonly asChild?: boolean;
}

export const EditorBubbleItem = forwardRef<
  HTMLButtonElement,
  EditorBubbleItemProps & Omit<ComponentPropsWithoutRef<"button">, "onSelect">
>(({ children, onSelect, asChild = false, onClick, ...rest }, ref) => {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : "button"}
      {...rest}
      onClick={(event) => {
        onClick?.(event);
        onSelect?.(editor);
      }}
    >
      {children}
    </Comp>
  );
});

EditorBubbleItem.displayName = "EditorBubbleItem";

export default EditorBubbleItem;
