import { EditorContent, EditorRoot } from "novel/client/core";
import StarterKit from "@tiptap/starter-kit";
import type { JSONContent } from "novel/server";

interface ClientEditorProps {
  content: JSONContent;
}

export default function ClientEditor({ content }: ClientEditorProps) {
  return (
    <EditorRoot>
      <EditorContent
        initialContent={content}
        extensions={[StarterKit]}
        shouldRerenderOnTransaction={true}
        className="ProseMirror"
      />
    </EditorRoot>
  );
}
