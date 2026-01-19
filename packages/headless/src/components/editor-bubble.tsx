import { isNodeSelection } from "@tiptap/core";
import { useCurrentEditor } from "@tiptap/react";
import { BubbleMenu, type BubbleMenuProps } from "@tiptap/react/menus";
import { forwardRef } from "react";
import type { ReactNode } from "react";

export interface EditorBubbleProps extends Omit<BubbleMenuProps, "editor"> {
  readonly children: ReactNode;
}

export const EditorBubble = forwardRef<HTMLDivElement, EditorBubbleProps>(
  ({ children, shouldShow, ...rest }, ref) => {
    const { editor: currentEditor } = useCurrentEditor();
    const resolvedShouldShow: BubbleMenuProps["shouldShow"] =
      shouldShow ??
      (({ editor, state }) => {
        const { selection } = state;
        const { empty } = selection;

        // don't show bubble menu if:
        // - the editor is not editable
        // - the selected node is an image
        // - the selection is empty
        // - the selection is a node selection (for drag handles)
        if (!editor.isEditable || editor.isActive("image") || empty || isNodeSelection(selection)) {
          return false;
        }
        return true;
      });

    if (!currentEditor) return null;

    return (
      <BubbleMenu ref={ref} editor={currentEditor} shouldShow={resolvedShouldShow} {...rest}>
        {children}
      </BubbleMenu>
    );
  },
);

EditorBubble.displayName = "EditorBubble";

export default EditorBubble;
