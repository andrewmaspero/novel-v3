import { describe, expect, it } from "vitest";
import * as root from "./index";
import * as client from "./client";
import * as core from "./client/core";
import * as server from "./server";

describe("exports", () => {
  it("exposes client and server entry points", () => {
    expect(root).toBeTruthy();
    expect(client.EditorRoot).toBeDefined();
    expect(core.EditorRoot).toBeDefined();
    expect(server.renderToHTMLString).toBeDefined();
  });
});
