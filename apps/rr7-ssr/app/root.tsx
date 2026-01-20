import type { ReactNode } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, type LinksFunction } from "react-router";
import { Toaster } from "sonner";
import stylesHref from "./styles.css?url";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: stylesHref }];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Novel - React Router v7 SSR</title>
        <Meta />
        <Links />
      </head>
      <body className="bg-background text-foreground">
        <Toaster />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}
