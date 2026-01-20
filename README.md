<a href="https://novel.sh">
  <img alt="Novel is a Notion-style WYSIWYG editor with AI-powered autocompletions." src="https://novel.sh/opengraph-image.png">
  <h1 align="center">Novel</h1>
</a>

<p align="center">
  A production-ready, Notion-style WYSIWYG editor built on TipTap v3 with AI-assisted writing,
  SSR-safe rendering, and a clean client/server split.
</p>

<p align="center">
  <a href="https://news.ycombinator.com/item?id=36360789"><img src="https://img.shields.io/badge/Hacker%20News-369-%23FF6600" alt="Hacker News"></a>
  <a href="https://github.com/steven-tey/novel/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/steven-tey/novel?label=license&logo=github&color=f80&logoColor=fff" alt="License" />
  </a>
  <a href="https://github.com/steven-tey/novel"><img src="https://img.shields.io/github/stars/steven-tey/novel?style=social" alt="Novel.sh's GitHub repo"></a>
</p>

<p align="center">
  <a href="#overview"><strong>Overview</strong></a> ·
  <a href="#monorepo-layout"><strong>Monorepo Layout</strong></a> ·
  <a href="#quick-start"><strong>Quick Start</strong></a> ·
  <a href="#api-examples"><strong>API Examples</strong></a> ·
  <a href="#dependency-status"><strong>Dependency Status</strong></a> ·
  <a href="#contributing"><strong>Contributing</strong></a> ·
  <a href="#license"><strong>License</strong></a>
</p>

## Docs

https://novel.sh/docs/introduction

## Overview

Novel is a modern, extensible rich-text editor built on TipTap v3. This repository ships a headless
package (`@vectorfy/novel`) plus two working apps (Next.js and React Router v7 SSR) that demonstrate SSR-safe
usage, AI-assisted completions, and a full menu/command system.

Key features:

- TipTap v3 core and extensions, plus custom extensions for commands, uploads, Twitter, YouTube,
  math, and more.
- Client/server split: client-only editor UI lives in `@vectorfy/novel/client`, while SSR rendering utilities
  live in `@vectorfy/novel/server`.
- Static rendering with `@tiptap/static-renderer` (HTML + Markdown) and SSR-safe editor creation.
- Built-in command UI and menu helpers (Bubble menu, command list, slash command helpers).
- Multiple reference apps: Next.js app router and React Router v7 SSR.

## Monorepo Layout

```
apps/
  web/        # Next.js app (App Router)
  rr7-ssr/    # React Router v7 SSR (Express adapter)
packages/
  headless/   # The Novel editor package (exports @vectorfy/novel, @vectorfy/novel/client, @vectorfy/novel/server)
  tsconfig/   # Shared TS config
```

## Quick Start

Install dependencies and run the workspace dev server:

```bash
pnpm install
pnpm dev
```

### Environment variables (apps/web)

- `OPENAI_API_KEY` - OpenAI API key (used by the AI completion route)
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob read/write token (used by the image upload route)

If you deployed to Vercel, you can pull envs with:

```bash
vc env pull
```

### Useful workspace scripts

```bash
pnpm -w typecheck
pnpm -w build
pnpm -w lint
pnpm -w test
```

## Packages and Entry Points

The `@vectorfy/novel` package exposes explicit SSR-safe entry points:

| Entry Point         | Use Case |
|---------------------|----------|
| `@vectorfy/novel`             | Client-only bundle (re-exports `@vectorfy/novel/client`) |
| `@vectorfy/novel/client`      | Full client API: components, extensions, plugins, utils |
| `@vectorfy/novel/client/core` | Client UI components only (smaller bundle) |
| `@vectorfy/novel/server`      | Static rendering + SSR-safe editor creation |

## API Examples

### 1) Basic editor (client)

```tsx
"use client";

import {
  EditorRoot,
  EditorContent,
  StarterKit,
  type JSONContent,
} from "@vectorfy/novel/client";

const initialContent: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph", content: [{ type: "text", text: "Hello Novel" }] }],
};

export function Editor() {
  return (
    <EditorRoot>
      <EditorContent extensions={[StarterKit]} content={initialContent} />
    </EditorRoot>
  );
}
```

### 2) Command UI (slash command + menu)

```tsx
"use client";

import {
  EditorRoot,
  EditorContent,
  EditorCommand,
  EditorCommandList,
  EditorCommandItem,
  StarterKit,
  Command,
  createSuggestionItems,
  handleCommandNavigation,
} from "@vectorfy/novel/client";

const items = createSuggestionItems([
  { title: "Heading 1", command: ({ editor }) => editor.chain().focus().toggleHeading({ level: 1 }).run() },
  { title: "Bullet List", command: ({ editor }) => editor.chain().focus().toggleBulletList().run() },
]);

export function EditorWithCommands() {
  return (
    <EditorRoot>
      <EditorContent
        extensions={[
          StarterKit,
          Command.configure({
            suggestion: {
              items: () => items,
              render: () => ({
                onKeyDown: handleCommandNavigation,
              }),
            },
          }),
        ]}
      />
      <EditorCommand className="command-menu">
        <EditorCommandList>
          {items.map((item) => (
            <EditorCommandItem key={item.title} onCommand={item.command}>
              {item.title}
            </EditorCommandItem>
          ))}
        </EditorCommandList>
      </EditorCommand>
    </EditorRoot>
  );
}
```

### 3) Image uploads (client plugin)

```tsx
"use client";

import {
  EditorRoot,
  EditorContent,
  StarterKit,
  UploadImagesPlugin,
  createImageUpload,
} from "@vectorfy/novel/client";

const uploadFn = async (file: File) => {
  // Replace with your uploader; return a public URL.
  const url = await uploadToBlob(file);
  return url;
};

export function EditorWithUploads() {
  return (
    <EditorRoot>
      <EditorContent
        extensions={[StarterKit]}
        editorProps={{
          attributes: { class: "prose" },
        }}
        plugins={[
          UploadImagesPlugin({
            uploadFn,
            onUpload: createImageUpload(uploadFn),
          }),
        ]}
      />
    </EditorRoot>
  );
}
```

### 4) SSR rendering (server)

```ts
import {
  renderToHTMLString,
  renderToMarkdown,
  serverExtensions,
  type JSONContent,
} from "@vectorfy/novel/server";

const content: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph", content: [{ type: "text", text: "SSR-safe" }] }],
};

const html = renderToHTMLString({ content, extensions: serverExtensions });
const markdown = renderToMarkdown({ content, extensions: serverExtensions });
```

### 5) React Router v7 SSR (client-only editor)

```tsx
import { Suspense, lazy, useEffect, useState } from "react";

const ClientEditor = lazy(() => import("./components/client-editor"));

export default function IndexRoute() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Suspense fallback={<div>Loading editor...</div>}>
      {mounted ? <ClientEditor /> : null}
    </Suspense>
  );
}
```

## Dependency Status

All workspace dependencies are up to date as of January 19, 2026. The repo is maintained with
`pnpm -r up -L`, and `pnpm -r outdated` reports no pending updates on this date. To re-verify:

```bash
pnpm -r outdated
```

## Tech Stack

- TipTap v3
- Next.js App Router
- React Router v7 SSR (Express adapter)
- Vercel AI SDK + OpenAI
- Tailwind CSS
- Floating UI

## Contributing

- Open an issue if you find a bug or want to propose a feature.
- PRs are welcome. Please run `pnpm -w typecheck`, `pnpm -w lint`, and `pnpm -w build` before submitting.

## License

Licensed under the Apache-2.0 license.
