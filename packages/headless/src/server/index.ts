import { Editor, type EditorOptions, type Extensions } from "@tiptap/core";
import { renderToHTMLString as renderToHTMLStringBase } from "@tiptap/static-renderer/pm/html-string";
import { renderToMarkdown as renderToMarkdownBase } from "@tiptap/static-renderer/pm/markdown";
import { serverExtensions } from "../extensions/server";

type StaticHTMLRendererOptions = Parameters<typeof renderToHTMLStringBase>[0];
type StaticMarkdownRendererOptions = Parameters<typeof renderToMarkdownBase>[0];

export type RenderHTMLStringOptions = Omit<StaticHTMLRendererOptions, "extensions"> & {
  extensions?: StaticHTMLRendererOptions["extensions"];
};

export type RenderMarkdownOptions = Omit<StaticMarkdownRendererOptions, "extensions"> & {
  extensions?: StaticMarkdownRendererOptions["extensions"];
};

export type CreateServerEditorOptions = Omit<Partial<EditorOptions>, "element" | "extensions" | "content"> & {
  extensions?: Extensions;
  content?: EditorOptions["content"];
};

export const renderToHTMLString = ({ extensions, ...options }: RenderHTMLStringOptions) =>
  renderToHTMLStringBase({
    ...options,
    extensions: extensions ?? serverExtensions,
  });

export const renderToMarkdown = ({ extensions, ...options }: RenderMarkdownOptions) =>
  renderToMarkdownBase({
    ...options,
    extensions: extensions ?? serverExtensions,
  });

export const createServerEditor = ({
  extensions,
  content,
  ...options
}: CreateServerEditorOptions) =>
  new Editor(
    {
      element: null,
      extensions: extensions ?? serverExtensions,
      content: content ?? null,
      ...options,
    } as EditorOptions,
  );

export { serverExtensions };

export type { Extension, JSONContent } from "@tiptap/core";
