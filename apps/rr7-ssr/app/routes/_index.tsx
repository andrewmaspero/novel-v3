import { type JSONContent, renderToHTMLString, serverExtensions } from "novel/server";
import { lazy, Suspense, useEffect, useState } from "react";
import { useLoaderData } from "react-router";

const ClientEditor = lazy(() => import("../components/client-editor"));

const initialContent: JSONContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Novel + React Router v7 SSR" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "This page renders static HTML on the server and loads the editor on the client.",
        },
      ],
    },
  ],
};

export const loader = () => {
  const html = renderToHTMLString({ content: initialContent, extensions: serverExtensions });
  return { content: initialContent, html };
};

export default function Index() {
  const { content, html } = useLoaderData<typeof loader>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main style={{ margin: "2rem auto", maxWidth: "960px", padding: "0 1.5rem" }}>
      <section>
        <h1 style={{ marginBottom: "0.5rem" }}>SSR preview</h1>
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "16px",
            background: "#f9fafb",
          }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2 style={{ marginBottom: "0.5rem" }}>Client editor</h2>
        {mounted ? (
          <Suspense fallback={<div>Loading editor...</div>}>
            <ClientEditor content={content} />
          </Suspense>
        ) : null}
      </section>
    </main>
  );
}
